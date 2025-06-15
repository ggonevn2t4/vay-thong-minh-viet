
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Document } from '@/types/document';

export const fetchDocuments = async (userId: string): Promise<Document[]> => {
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

export const uploadDocument = async (variables: { file: File; name: string; description?: string; category: string; user: User; }): Promise<Document> => {
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

export const deleteDocument = async (filePath: string, documentId: string) => {
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

export const getDocumentUrl = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 3600); // 1 hour expiry
  if (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
  return data?.signedUrl;
};
