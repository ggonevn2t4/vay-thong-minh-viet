
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      const formattedDocuments: Document[] = data.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        filePath: doc.file_path,
        fileSize: doc.file_size,
        contentType: doc.content_type,
        category: doc.category,
        status: doc.status,
        uploadedAt: new Date(doc.uploaded_at),
        reviewedAt: doc.reviewed_at ? new Date(doc.reviewed_at) : undefined,
        reviewedBy: doc.reviewed_by,
        userId: doc.user_id
      }));

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Không thể tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (
    file: File,
    name: string,
    description?: string,
    category: string = 'general'
  ) => {
    if (!user) return null;

    setIsUploading(true);
    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
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

      const newDocument: Document = {
        id: data.id,
        name: data.name,
        description: data.description,
        filePath: data.file_path,
        fileSize: data.file_size,
        contentType: data.content_type,
        category: data.category,
        status: data.status,
        uploadedAt: new Date(data.uploaded_at),
        reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
        reviewedBy: data.reviewed_by,
        userId: data.user_id
      };

      setDocuments(prev => [newDocument, ...prev]);
      toast.success('Tài liệu đã được tải lên thành công');
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Không thể tải lên tài liệu');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Đã xóa tài liệu');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Không thể xóa tài liệu');
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  // Set up real-time subscription for documents
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('documents-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const updatedDocument = payload.new as any;
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === updatedDocument.id
              ? {
                  ...doc,
                  status: updatedDocument.status,
                  reviewedAt: updatedDocument.reviewed_at ? new Date(updatedDocument.reviewed_at) : undefined,
                  reviewedBy: updatedDocument.reviewed_by
                }
              : doc
          )
        );

        // Show notification for status changes
        if (updatedDocument.status === 'approved') {
          toast.success(`Tài liệu "${updatedDocument.name}" đã được phê duyệt`);
        } else if (updatedDocument.status === 'rejected') {
          toast.error(`Tài liệu "${updatedDocument.name}" đã bị từ chối`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    documents,
    isLoading,
    isUploading,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    loadDocuments
  };
};
