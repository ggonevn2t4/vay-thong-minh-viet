import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDocuments } from '@/hooks/useDocuments';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface LegalDocumentUploadProps {
  onUploadComplete: () => void;
  onNext: () => void;
}

const LegalDocumentUpload: React.FC<LegalDocumentUploadProps> = ({ 
  onUploadComplete, 
  onNext 
}) => {
  const { documents, uploadDocument, isUploading, deleteDocument } = useDocuments();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const legalDocumentTypes = [
    {
      id: 'identity',
      name: 'Giấy tờ tùy thân',
      description: 'CMND/CCCD/Hộ chiếu',
      required: true,
      examples: ['Chứng minh nhân dân', 'Căn cước công dân', 'Hộ chiếu']
    },
    {
      id: 'income',
      name: 'Chứng minh thu nhập',
      description: 'Bảng lương, hợp đồng lao động',
      required: true,
      examples: ['Bảng lương 3 tháng gần nhất', 'Hợp đồng lao động', 'Giấy xác nhận thu nhập']
    },
    {
      id: 'bank_statement',
      name: 'Sao kê ngân hàng',
      description: 'Sao kê 6 tháng gần nhất',
      required: true,
      examples: ['Sao kê tài khoản lương', 'Sao kê tài khoản tiết kiệm']
    },
    {
      id: 'collateral',
      name: 'Tài sản đảm bảo',
      description: 'Giấy tờ tài sản thế chấp',
      required: false,
      examples: ['Sổ đỏ/Sổ hồng', 'Giấy tờ xe', 'Chứng nhận đầu tư']
    },
    {
      id: 'business',
      name: 'Giấy tờ kinh doanh',
      description: 'Đối với hộ kinh doanh/doanh nghiệp',
      required: false,
      examples: ['Giấy phép kinh doanh', 'Báo cáo tài chính', 'Hợp đồng mua bán']
    }
  ];

  const legalDocuments = documents.filter(doc => 
    doc.category === 'legal' || doc.category === 'identity' || doc.category === 'income'
  );

  const requiredDocCount = legalDocumentTypes.filter(type => type.required).length;
  const uploadedRequiredCount = legalDocumentTypes.filter(type => 
    type.required && legalDocuments.some(doc => doc.category === type.id)
  ).length;

  const completionPercentage = Math.round((uploadedRequiredCount / requiredDocCount) * 100);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], 'legal');
    }
  };

  const handleFileUpload = async (file: File, category: string) => {
    try {
      setUploadProgress(0);
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 100);

      await uploadDocument(
        file,
        file.name,
        `Tài liệu pháp lý - ${category}`,
        category
      );

      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        if (completionPercentage >= 100) {
          onUploadComplete();
        }
      }, 1000);

      toast.success('Tải tài liệu thành công!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Không thể tải lên tài liệu');
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, category);
    }
  };

  const getDocumentStatus = (categoryId: string) => {
    const hasDoc = legalDocuments.some(doc => doc.category === categoryId);
    if (hasDoc) {
      const doc = legalDocuments.find(doc => doc.category === categoryId);
      return doc?.status || 'pending';
    }
    return 'missing';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'missing': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return AlertTriangle;
      case 'rejected': return X;
      case 'missing': return Plus;
      default: return Plus;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Tình trạng tải tài liệu
            </CardTitle>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {uploadedRequiredCount}/{requiredDocCount} bắt buộc
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Hoàn thành tài liệu bắt buộc</span>
              <span className="font-semibold">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Đang tải lên...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {legalDocumentTypes.map((docType) => {
          const status = getDocumentStatus(docType.id);
          const StatusIcon = getStatusIcon(status);
          const existingDoc = legalDocuments.find(doc => doc.category === docType.id);
          
          return (
            <Card key={docType.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{docType.name}</CardTitle>
                      {docType.required && (
                        <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                          Bắt buộc
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{docType.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Ví dụ:</p>
                      {docType.examples.map((example, index) => (
                        <span key={index} className="text-xs text-gray-600 block">
                          • {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {existingDoc ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium truncate">
                          {existingDoc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => deleteDocument(existingDoc.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="outline" className={`w-full justify-center ${getStatusColor(status)}`}>
                      {status === 'approved' && 'Đã phê duyệt'}
                      {status === 'pending' && 'Đang xem xét'}
                      {status === 'rejected' && 'Bị từ chối'}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Kéo thả tài liệu vào đây hoặc
                      </p>
                      <input
                        type="file"
                        id={`file-${docType.id}`}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileSelect(e, docType.id)}
                      />
                      <label htmlFor={`file-${docType.id}`}>
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">Chọn tệp</span>
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, DOC, JPG, PNG (tối đa 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-gray-600">
          {completionPercentage < 100 ? (
            <span>Vui lòng tải lên tất cả tài liệu bắt buộc để tiếp tục</span>
          ) : (
            <span className="text-green-600 font-medium">✓ Đã tải lên đủ tài liệu bắt buộc</span>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={completionPercentage < 100 || isUploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Tiếp tục xem xét
        </Button>
      </div>

      {/* Security Notice */}
      <Alert className="border-green-200 bg-green-50">
        <AlertTriangle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <strong>Lưu ý bảo mật:</strong> Tất cả tài liệu được mã hóa và chỉ những người được ủy quyền mới có thể truy cập.
          Tài liệu sẽ được tự động xóa sau khi hoàn tất quy trình vay vốn.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDocumentUpload;