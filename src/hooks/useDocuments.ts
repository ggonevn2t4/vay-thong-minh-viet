import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { Document } from '@/types/document';
import * as documentService from '@/services/documentService';

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
    queryFn: () => documentService.fetchDocuments(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: [] as Document[],
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message || 'Không thể tải danh sách tài liệu');
    }
  }, [isError, error]);

  const { mutateAsync: uploadMutation, isPending: isUploading } = useMutation({
    mutationFn: (variables: { file: File; name: string; description?: string; category: string; }) => {
      if (!user) throw new Error("User not authenticated");
      return documentService.uploadDocument({ ...variables, user });
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
      return documentService.deleteDocument(document.filePath, document.id);
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
    return documentService.getDocumentUrl(filePath);
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
