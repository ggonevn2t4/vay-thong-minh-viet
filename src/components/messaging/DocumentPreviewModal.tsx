
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';

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
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    if (isOpen && attachment) {
      fetchFileUrl();
      fetchDownloadCount();
    }
  }, [isOpen, attachment]);

  const fetchFileUrl = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .createSignedUrl(attachment.file_path, 3600);

      if (error) throw error;
      setFileUrl(data.signedUrl);
    } catch (error) {
      console.error('Error fetching file URL:', error);
      toast.error('Không thể tải tệp tin');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDownloadCount = async () => {
    try {
      const { data, error } = await supabase
        .from('document_downloads')
        .select('count')
        .eq('attachment_id', attachment.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching download count:', error);
        return;
      }

      setDownloadCount(data?.count || 0);
    } catch (error) {
      console.error('Error fetching download count:', error);
    }
  };

  const handleDownload = async () => {
    try {
      // Track download
      await trackDownload();

      // Download file
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Tệp tin đã được tải xuống');
      
      // Update download count
      setDownloadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Không thể tải xuống tệp tin');
    }
  };

  const trackDownload = async () => {
    try {
      const { data: existingRecord, error: fetchError } = await supabase
        .from('document_downloads')
        .select('*')
        .eq('attachment_id', attachment.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingRecord) {
        // Update existing count
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
            count: 1,
            last_downloaded_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isPDF = attachment.content_type === 'application/pdf';
  const isImage = attachment.content_type.startsWith('image/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg font-semibold truncate">
              {attachment.file_name}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>{formatFileSize(attachment.file_size)}</span>
              <span>•</span>
              <span>{downloadCount} lượt tải xuống</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : isPDF ? (
            <PDFViewer fileUrl={fileUrl} />
          ) : isImage ? (
            <ImageViewer fileUrl={fileUrl} fileName={attachment.file_name} />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg mb-2">Không thể xem trước tệp tin này</p>
              <p className="text-sm">Vui lòng tải xuống để xem nội dung</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
