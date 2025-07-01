
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const getImageUrl = () => {
    const { data } = supabase.storage
      .from('message-attachments')
      .getPublicUrl(attachment.file_path);
    return data.publicUrl;
  };

  const isImage = attachment.content_type.startsWith('image/');

  return (
    <div className="bg-gray-50 border rounded-lg p-3 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        {getFileIcon(attachment.content_type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.file_name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(attachment.file_size)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      {isImage && (
        <div className="mt-2">
          <img
            src={getImageUrl()}
            alt={attachment.file_name}
            className="max-w-full h-auto rounded border"
            style={{ maxHeight: '200px' }}
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MessageAttachment;
