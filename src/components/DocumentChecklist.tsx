
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const [documents, setDocuments] = useState<DocumentItem[]>([
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

  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  const completedCount = documents.filter(doc => doc.completed).length;
  const requiredCount = documents.filter(doc => doc.required).length;
  const completedRequired = documents.filter(doc => doc.required && doc.completed).length;
  const progress = (completedRequired / requiredCount) * 100;

  const handleDocumentToggle = (documentId: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, completed: !doc.completed, uploadedAt: !doc.completed ? new Date() : undefined }
          : doc
      )
    );
    
    const document = documents.find(doc => doc.id === documentId);
    if (document && !document.completed) {
      toast.success(`Đã đánh dấu hoàn thành: ${document.name}`);
    }
  };

  const handleUpload = (documentId: string) => {
    // Simulate file upload
    toast.success('Tính năng upload sẽ được triển khai với Supabase Storage');
  };

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const getCategoryProgress = (category: string) => {
    const categoryDocs = getDocumentsByCategory(category);
    const completedDocs = categoryDocs.filter(doc => doc.completed);
    return categoryDocs.length > 0 ? (completedDocs.length / categoryDocs.length) * 100 : 0;
  };

  return (
    <div className="space-y-6">
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
              {getDocumentsByCategory(category).map(document => (
                <div key={document.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={document.id}
                    checked={document.completed}
                    onCheckedChange={() => handleDocumentToggle(document.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <label
                        htmlFor={document.id}
                        className={`font-medium cursor-pointer ${
                          document.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {document.name}
                      </label>
                      {document.required && (
                        <Badge variant="destructive" className="text-xs">
                          Bắt buộc
                        </Badge>
                      )}
                      {document.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {document.required && !document.completed && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {document.description}
                    </p>
                    
                    {document.completed && document.uploadedAt && (
                      <p className="text-xs text-green-600">
                        Hoàn thành lúc: {document.uploadedAt.toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpload(document.id)}
                    className="flex items-center gap-1"
                  >
                    <Upload className="h-3 w-3" />
                    Upload
                  </Button>
                </div>
              ))}
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
