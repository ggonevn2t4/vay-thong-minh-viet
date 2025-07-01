
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileText, Image, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUploaded: (attachment: MessageAttachment) => void;
  disabled?: boolean;
}

interface MessageAttachment {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create attachment record
      const attachment: MessageAttachment = {
        id: crypto.randomUUID(),
        file_name: selectedFile.name,
        file_path: filePath,
        file_size: selectedFile.size,
        content_type: selectedFile.type
      };

      onFileUploaded(attachment);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (contentType.includes('pdf') || contentType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
        disabled={disabled || uploading}
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 max-w-xs">
          {getFileIcon(selectedFile.type)}
          <span className="text-sm truncate">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={uploading}
            className="h-6 px-2 text-xs"
          >
            {uploading ? 'Uploading...' : 'Send'}
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="h-8 w-8 p-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
