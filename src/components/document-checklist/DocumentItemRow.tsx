
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { UploadedDocumentRow } from './UploadedDocumentRow';
import type { DocumentItem } from './types';
import type { Document } from '@/types/document';

interface DocumentItemRowProps {
  documentItem: DocumentItem;
  isCompleted: boolean;
  uploadedDocs: Document[];
  isUploading: boolean;
  onUploadClick: (documentId: string) => void;
  onViewDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

export const DocumentItemRow = ({
  documentItem,
  isCompleted,
  uploadedDocs,
  isUploading,
  onUploadClick,
  onViewDocument,
  onDeleteDocument,
}: DocumentItemRowProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3 p-4 border rounded-lg">
        <Checkbox
          id={documentItem.id}
          checked={isCompleted}
          disabled
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <label
              htmlFor={documentItem.id}
              className={`font-medium ${
                isCompleted ? 'line-through text-gray-500' : ''
              }`}
            >
              {documentItem.name}
            </label>
            {documentItem.required && (
              <Badge variant="destructive" className="text-xs">
                Bắt buộc
              </Badge>
            )}
            {isCompleted && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {documentItem.required && !isCompleted && (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {documentItem.description}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUploadClick(documentItem.id)}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Upload className="h-3 w-3" />
          {isUploading ? 'Đang tải...' : 'Tải lên'}
        </Button>
      </div>

      {uploadedDocs.length > 0 && (
        <div className="ml-8 space-y-2">
          {uploadedDocs.map(doc => (
            <UploadedDocumentRow
              key={doc.id}
              doc={doc}
              onView={onViewDocument}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};

