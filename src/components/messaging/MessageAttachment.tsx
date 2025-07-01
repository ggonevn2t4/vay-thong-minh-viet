
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DocumentPreviewModal from './DocumentPreviewModal';

interface MessageAttachmentProps {
  attachment: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    content_type: string;
  };
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (contentType.includes('pdf') || contentType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .download(attachment.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Track download
      await trackDownload();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
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

  const getImageUrl = () => {
    const { data } = supabase.storage
      .from('message-attachments')
      .getPublicUrl(attachment.file_path);
    return data.publicUrl;
  };

  const isImage = attachment.content_type.startsWith('image/');
  const isPDF = attachment.content_type === 'application/pdf';
  const isPreviewable = isImage || isPDF;

  return (
    <>
      <div className="bg-gray-50 border rounded-lg p-3 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          {getFileIcon(attachment.content_type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.file_name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(attachment.file_size)}</p>
          </div>
          <div className="flex gap-1">
            {isPreviewable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="h-8 w-8 p-0"
                title="Xem trước"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
              title="Tải xuống"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isImage && (
          <div className="mt-2">
            <img
              src={getImageUrl()}
              alt={attachment.file_name}
              className="max-w-full h-auto rounded border cursor-pointer hover:opacity-80 transition-opacity"
              style={{ maxHeight: '200px' }}
              onClick={() => setShowPreview(true)}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        attachment={attachment}
      />
    </>
  );
};

export default MessageAttachment;
