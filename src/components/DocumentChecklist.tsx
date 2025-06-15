
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, AlertCircle, Upload, File, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import type { Document } from '@/types/document';

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  completed: boolean;
  uploadedAt?: Date;
}

const DocumentChecklist = () => {
  const { user } = useAuth();
  const { documents, isUploading, uploadDocument, deleteDocument, getDocumentUrl } = useDocuments();
  const { createNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const [documentItems] = useState<DocumentItem[]>([
    {
      id: '1',
      name: 'CMND/CCCD',
      description: 'Chứng minh nhân dân hoặc căn cước công dân còn hiệu lực',
      required: true,
      category: 'Giấy tờ tùy thân',
      completed: false
    },
    {
      id: '2',
      name: 'Sổ hộ khẩu',
      description: 'Bản sao có công chứng sổ hộ khẩu',
      required: true,
      category: 'Giấy tờ tùy thân',
      completed: false
    },
    {
      id: '3',
      name: 'Hợp đồng lao động',
      description: 'Hợp đồng lao động còn hiệu lực',
      required: true,
      category: 'Giấy tờ thu nhập',
      completed: false
    },
    {
      id: '4',
      name: 'Bảng lương 3 tháng gần nhất',
      description: 'Bảng lương có xác nhận của công ty',
      required: true,
      category: 'Giấy tờ thu nhập',
      completed: false
    },
    {
      id: '5',
      name: 'Sao kê tài khoản 6 tháng',
      description: 'Sao kê tài khoản ngân hàng 6 tháng gần nhất',
      required: true,
      category: 'Tài chính',
      completed: false
    },
    {
      id: '6',
      name: 'Giấy tờ tài sản đảm bảo',
      description: 'Sổ đỏ hoặc giấy tờ chứng minh quyền sở hữu tài sản',
      required: false,
      category: 'Tài sản đảm bảo',
      completed: false
    }
  ]);

  const categories = Array.from(new Set(documentItems.map(doc => doc.category)));
  const requiredCount = documentItems.filter(doc => doc.required).length;
  
  // Check completion based on uploaded documents
  const getDocumentCompletion = (documentName: string) => {
    return documents.some(doc => 
      doc.name.toLowerCase().includes(documentName.toLowerCase()) && 
      doc.status !== 'rejected'
    );
  };

  const completedRequired = documentItems.filter(doc => 
    doc.required && getDocumentCompletion(doc.name)
  ).length;

  // Add the missing completedCount variable
  const completedCount = documentItems.filter(doc => getDocumentCompletion(doc.name)).length;
  
  const progress = (completedRequired / requiredCount) * 100;

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
      // Create notification for successful upload
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

  const getDocumentsByCategory = (category: string) => {
    return documentItems.filter(doc => doc.category === category);
  };

  const getCategoryProgress = (category: string) => {
    const categoryDocs = getDocumentsByCategory(category);
    const completedDocs = categoryDocs.filter(doc => getDocumentCompletion(doc.name));
    return categoryDocs.length > 0 ? (completedDocs.length / categoryDocs.length) * 100 : 0;
  };

  const getUploadedDocuments = (documentName: string) => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(documentName.toLowerCase())
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã phê duyệt';
      case 'rejected': return 'Bị từ chối';
      default: return 'Đang xem xét';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tiến độ hoàn thành hồ sơ
          </CardTitle>
          <CardDescription>
            Đã hoàn thành {completedRequired}/{requiredCount} giấy tờ bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Giấy tờ bắt buộc</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Đã hoàn thành</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">{documents.length - completedCount}</div>
                <div className="text-sm text-gray-600">Còn lại</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">{requiredCount - completedRequired}</div>
                <div className="text-sm text-gray-600">Bắt buộc còn lại</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{requiredCount}</div>
                <div className="text-sm text-gray-600">Tổng bắt buộc</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Category */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{category}</CardTitle>
              <Badge variant="outline">
                {getCategoryProgress(category).toFixed(0)}% hoàn thành
              </Badge>
            </div>
            <Progress value={getCategoryProgress(category)} className="h-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDocumentsByCategory(category).map(documentItem => {
                const uploadedDocs = getUploadedDocuments(documentItem.name);
                const isCompleted = getDocumentCompletion(documentItem.name);
                
                return (
                  <div key={documentItem.id} className="space-y-3">
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
                        onClick={() => handleUploadClick(documentItem.id)}
                        disabled={isUploading}
                        className="flex items-center gap-1"
                      >
                        <Upload className="h-3 w-3" />
                        {isUploading ? 'Đang tải...' : 'Tải lên'}
                      </Button>
                    </div>

                    {/* Show uploaded documents for this category */}
                    {uploadedDocs.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {uploadedDocs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                                onClick={() => handleViewDocument(doc)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          className="flex-1"
          disabled={completedRequired < requiredCount}
        >
          Nộp hồ sơ ({completedRequired}/{requiredCount})
        </Button>
        <Button variant="outline">
          Lưu tiến độ
        </Button>
      </div>
    </div>
  );
};

export default DocumentChecklist;
