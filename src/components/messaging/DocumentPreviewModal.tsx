
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';
import { toast } from 'sonner';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    content_type: string;
  };
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  attachment
}) => {
  const [fileUrl, setFileUrl] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen && attachment) {
      loadFileUrl();
      trackDownload();
    }
  }, [isOpen, attachment]);

  const loadFileUrl = async () => {
    try {
      setIsLoading(true);
      const { data } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(attachment.file_path);
      
      setFileUrl(data.publicUrl);
    } catch (error) {
      console.error('Error loading file URL:', error);
      toast.error('Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  const trackDownload = async () => {
    try {
      // Check if download record exists
      const { data: existingRecord } = await supabase
        .from('document_downloads')
        .select('*')
        .eq('attachment_id', attachment.id)
        .single();

      if (existingRecord) {
        // Update existing record
        await supabase
          .from('document_downloads')
          .update({
            count: existingRecord.count + 1,
            last_downloaded_at: new Date().toISOString()
          })
          .eq('attachment_id', attachment.id);
      } else {
        // Create new record
        await supabase
          .from('document_downloads')
          .insert({
            attachment_id: attachment.id,
            count: 1
          });
      }
    } catch (error) {
      console.error('Error tracking download:', error);
      // Don't show error to user as this is background tracking
    }
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      );
    }

    const isPDF = attachment.content_type === 'application/pdf';
    const isImage = attachment.content_type.startsWith('image/');

    if (isPDF) {
      return <PDFViewer fileUrl={fileUrl} />;
    }

    if (isImage) {
      return <ImageViewer fileUrl={fileUrl} fileName={attachment.file_name} />;
    }

    // For other file types, show a message
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <p className="text-lg mb-4">Preview not available for this file type</p>
        <p className="text-sm">File: {attachment.file_name}</p>
        <p className="text-sm">Size: {formatFileSize(attachment.file_size)}</p>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-left truncate">
            {attachment.file_name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1" style={{ height: 'calc(90vh - 120px)' }}>
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
