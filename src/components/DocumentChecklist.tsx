
import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import type { Document } from '@/types/document';
import { documentItems, categories } from './document-checklist/types';
import { DocumentChecklistOverview } from './document-checklist/DocumentChecklistOverview';
import { DocumentCategoryCard } from './document-checklist/DocumentCategoryCard';
import { DocumentChecklistActions } from './document-checklist/DocumentChecklistActions';

const DocumentChecklist = () => {
  const { user } = useAuth();
  const { documents, isUploading, uploadDocument, deleteDocument, getDocumentUrl } = useDocuments();
  const { createNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const requiredCount = useMemo(() => documentItems.filter(doc => doc.required).length, []);

  const getDocumentCompletion = (documentName: string) => {
    return documents.some(doc => 
      doc.name.toLowerCase().includes(documentName.toLowerCase()) && 
      doc.status !== 'rejected'
    );
  };

  const completedRequired = useMemo(() => {
    return documentItems.filter(doc => 
      doc.required && getDocumentCompletion(doc.name)
    ).length;
  }, [documents]);

  const completedCount = useMemo(() => {
    return documentItems.filter(doc => getDocumentCompletion(doc.name)).length;
  }, [documents]);
  
  const progress = requiredCount > 0 ? (completedRequired / requiredCount) * 100 : 0;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocument) return;

    const documentItem = documentItems.find(doc => doc.id === selectedDocument);
    if (!documentItem) return;

    const uploadedDoc = await uploadDocument(
      file,
      documentItem.name,
      documentItem.description,
      documentItem.category
    );

    if (uploadedDoc) {
      await createNotification({
        title: 'Tài liệu đã được tải lên',
        message: `Tài liệu "${documentItem.name}" đã được tải lên thành công và đang chờ xem xét`,
        type: 'success',
        actionUrl: '/ho-so-tai-lieu'
      });
    }

    setSelectedDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = (documentId: string) => {
    setSelectedDocument(documentId);
    fileInputRef.current?.click();
  };

  const handleViewDocument = async (document: Document) => {
    const url = await getDocumentUrl(document.filePath);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Không thể mở tài liệu');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  const getUploadedDocuments = (documentName: string) => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(documentName.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      <DocumentChecklistOverview
        completedRequired={completedRequired}
        requiredCount={requiredCount}
        progress={progress}
        completedCount={completedCount}
        totalUploaded={documents.length}
      />

      {categories.map(category => (
        <DocumentCategoryCard
          key={category}
          category={category}
          documentItems={documentItems}
          getDocumentCompletion={getDocumentCompletion}
          getUploadedDocuments={getUploadedDocuments}
          isUploading={isUploading}
          onUploadClick={handleUploadClick}
          onViewDocument={handleViewDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      ))}

      <DocumentChecklistActions
        completedRequired={completedRequired}
        requiredCount={requiredCount}
      />
    </div>
  );
};

export default DocumentChecklist;

