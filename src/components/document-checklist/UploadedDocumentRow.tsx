
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { File, Eye, Trash2 } from 'lucide-react';
import { getStatusColor, getStatusText } from './utils';
import type { Document } from '@/types/document';

interface UploadedDocumentRowProps {
  doc: Document;
  onView: (document: Document) => void;
  onDelete: (documentId: string) => void;
}

export const UploadedDocumentRow = ({ doc, onView, onDelete }: UploadedDocumentRowProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <File className="h-4 w-4 text-blue-500" />
        <div>
          <p className="text-sm font-medium">{doc.name}</p>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
              {getStatusText(doc.status)}
            </Badge>
            <span className="text-xs text-gray-500">
              {doc.uploadedAt.toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(doc)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(doc.id)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

