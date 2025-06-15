import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';

export interface Document {
  id: string;
  name: string;
  description?: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  userId: string;
}

// --- Data Fetching and Mutation Functions ---

const fetchDocuments = async (userId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error loading documents:', error);
    throw new Error('Không thể tải danh sách tài liệu');
  }

  return data.map(doc => ({
    id: doc.id,
    name: doc.name,
    description: doc.description,
    filePath: doc.file_path,
    fileSize: doc.file_size,
    contentType: doc.content_type,
    category: doc.category,
    status: doc.status as 'pending' | 'approved' | 'rejected',
    uploadedAt: new Date(doc.uploaded_at),
    reviewedAt: doc.reviewed_at ? new Date(doc.reviewed_at) : undefined,
    reviewedBy: doc.reviewed_by,
    userId: doc.user_id
  }));
};

const uploadDocumentFn = async (variables: { file: File; name: string; description?: string; category: string; user: User; }): Promise<Document> => {
  const { file, name, description, category, user } = variables;
  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data, error: dbError } = await supabase
    .from('documents')
    .insert([{
      user_id: user.id,
      name,
      description,
      file_path: filePath,
      file_size: file.size,
      content_type: file.type,
      category
    }])
    .select()
    .single();

  if (dbError) throw dbError;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    filePath: data.file_path,
    fileSize: data.file_size,
    contentType: data.content_type,
    category: data.category,
    status: data.status as 'pending' | 'approved' | 'rejected',
    uploadedAt: new Date(data.uploaded_at),
    reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
    reviewedBy: data.reviewed_by,
    userId: data.user_id
  };
};

const deleteDocumentFn = async (filePath: string, documentId: string) => {
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  if (dbError) throw dbError;
};

const getDocumentUrlFn = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 3600); // 1 hour expiry
  if (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
  return data?.signedUrl;
};

// --- Real-time Subscription Handler ---

const handleRealtimeUpdate = (payload: any, queryClient: QueryClient, userId: string) => {
  console.log('Real-time change received!', payload);
  queryClient.invalidateQueries({ queryKey: ['documents', userId] });

  if (payload.eventType === 'UPDATE') {
    const updatedDocument = payload.new as any;
    const oldDocument = payload.old as any;
    if (updatedDocument.status !== oldDocument.status) {
      if (updatedDocument.status === 'approved') {
        toast.success(`Tài liệu "${updatedDocument.name}" đã được phê duyệt`);
      } else if (updatedDocument.status === 'rejected') {
        toast.error(`Tài liệu "${updatedDocument.name}" đã bị từ chối`);
      }
    }
  }
};


export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, isError, error } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: () => fetchDocuments(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: []
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message || 'Không thể tải danh sách tài liệu');
    }
  }, [isError, error]);

  const { mutateAsync: uploadMutation, isPending: isUploading } = useMutation({
    mutationFn: (variables: { file: File; name: string; description?: string; category: string; }) => {
      if (!user) throw new Error("User not authenticated");
      return uploadDocumentFn({ ...variables, user });
    },
    onSuccess: (newDocument) => {
      // The query invalidation is now handled by the real-time subscription,
      // but we can keep it for immediate feedback.
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast.success('Tài liệu đã được tải lên thành công');
      return newDocument;
    },
    onError: (error) => {
      console.error('Error uploading document:', error);
      toast.error('Không thể tải lên tài liệu');
    },
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: (documentId: string) => {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) throw new Error("Document not found to delete");
      return deleteDocumentFn(document.filePath, document.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast.success('Đã xóa tài liệu');
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast.error('Không thể xóa tài liệu');
    }
  });
  
  const uploadDocument = (file: File, name: string, description?: string, category: string = 'general') => {
    return uploadMutation({ file, name, description, category });
  };

  const getDocumentUrl = async (filePath: string) => {
    return getDocumentUrlFn(filePath);
  };

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`documents-user-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${user.id}`
      }, (payload) => handleRealtimeUpdate(payload, queryClient, user.id))
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Documents subscription successful');
        }
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('Documents subscription error:', err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    documents,
    isLoading,
    isUploading,
    uploadDocument,
    deleteDocument: deleteMutation,
    getDocumentUrl,
    loadDocuments: () => queryClient.invalidateQueries({ queryKey: ['documents', user?.id] })
  };
};
