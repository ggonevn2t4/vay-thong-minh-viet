
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DocumentItemRow } from './DocumentItemRow';
import type { DocumentItem } from './types';
import type { Document } from '@/types/document';

interface DocumentCategoryCardProps {
  category: string;
  documentItems: DocumentItem[];
  getDocumentCompletion: (documentName: string) => boolean;
  getUploadedDocuments: (documentName: string) => Document[];
  isUploading: boolean;
  onUploadClick: (documentId: string) => void;
  onViewDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

export const DocumentCategoryCard = ({
  category,
  documentItems,
  getDocumentCompletion,
  getUploadedDocuments,
  isUploading,
  onUploadClick,
  onViewDocument,
  onDeleteDocument,
}: DocumentCategoryCardProps) => {
  const getCategoryProgress = () => {
    const categoryDocs = documentItems.filter(doc => doc.category === category);
    const completedDocs = categoryDocs.filter(doc => getDocumentCompletion(doc.name));
    return categoryDocs.length > 0 ? (completedDocs.length / categoryDocs.length) * 100 : 0;
  };

  const docsForCategory = documentItems.filter(doc => doc.category === category);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{category}</CardTitle>
          <Badge variant="outline">
            {getCategoryProgress().toFixed(0)}% hoàn thành
          </Badge>
        </div>
        <Progress value={getCategoryProgress()} className="h-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {docsForCategory.map(documentItem => {
            const uploadedDocs = getUploadedDocuments(documentItem.name);
            const isCompleted = getDocumentCompletion(documentItem.name);
            
            return (
              <DocumentItemRow
                key={documentItem.id}
                documentItem={documentItem}
                isCompleted={isCompleted}
                uploadedDocs={uploadedDocs}
                isUploading={isUploading}
                onUploadClick={onUploadClick}
                onViewDocument={onViewDocument}
                onDeleteDocument={onDeleteDocument}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

