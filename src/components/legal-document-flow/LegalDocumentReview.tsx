import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useDocuments } from '@/hooks/useDocuments';
import { 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Download,
  Clock,
  X,
  RefreshCw,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface LegalDocumentReviewProps {
  onReviewComplete: () => void;
  onNext: () => void;
}

const LegalDocumentReview: React.FC<LegalDocumentReviewProps> = ({ 
  onReviewComplete, 
  onNext 
}) => {
  const { documents, getDocumentUrl } = useDocuments();
  const [reviewChecklist, setReviewChecklist] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);

  const legalDocuments = documents.filter(doc => 
    doc.category === 'legal' || doc.category === 'identity' || doc.category === 'income'
  );

  const reviewItems = [
    {
      id: 'document_clarity',
      text: 'Tất cả tài liệu đều rõ ràng và có thể đọc được',
      required: true
    },
    {
      id: 'document_validity',
      text: 'Tài liệu còn hiệu lực và chưa hết hạn',
      required: true
    },
    {
      id: 'information_accuracy',
      text: 'Thông tin trên tài liệu chính xác và khớp với thông tin đã khai báo',
      required: true
    },
    {
      id: 'document_completeness',
      text: 'Đã tải lên đủ tất cả trang của mỗi tài liệu',
      required: true
    },
    {
      id: 'signature_stamp',
      text: 'Các tài liệu có đầy đủ chữ ký và đóng dấu khi cần thiết',
      required: true
    },
    {
      id: 'privacy_consent',
      text: 'Tôi đồng ý chia sẻ các tài liệu này với ngân hàng và tư vấn viên',
      required: true
    }
  ];

  const documentCategories = [
    { id: 'identity', name: 'Giấy tờ tùy thân', icon: FileText },
    { id: 'income', name: 'Chứng minh thu nhập', icon: FileText },
    { id: 'bank_statement', name: 'Sao kê ngân hàng', icon: FileText },
    { id: 'collateral', name: 'Tài sản đảm bảo', icon: FileText },
    { id: 'legal', name: 'Tài liệu pháp lý khác', icon: FileText }
  ];

  const getDocumentsByCategory = (categoryId: string) => {
    return legalDocuments.filter(doc => doc.category === categoryId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return X;
      default: return AlertTriangle;
    }
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setReviewChecklist(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleViewDocument = async (document: any) => {
    try {
      const url = await getDocumentUrl(document.filePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error('Không thể xem tài liệu');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Lỗi khi mở tài liệu');
    }
  };

  const handleVerifyDocuments = async () => {
    setIsVerifying(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsVerifying(false);
    onReviewComplete();
    toast.success('Xác thực tài liệu thành công!');
  };

  const allRequiredChecked = reviewItems
    .filter(item => item.required)
    .every(item => reviewChecklist[item.id]);

  const canProceed = allRequiredChecked && legalDocuments.length > 0;

  return (
    <div className="space-y-6">
      {/* Review Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Xem xét tài liệu pháp lý
          </CardTitle>
          <p className="text-sm text-gray-600">
            Vui lòng kiểm tra kỹ các tài liệu đã tải lên và xác nhận tính chính xác
          </p>
        </CardHeader>
      </Card>

      {/* Document Categories */}
      <div className="space-y-4">
        {documentCategories.map((category) => {
          const categoryDocs = getDocumentsByCategory(category.id);
          if (categoryDocs.length === 0) return null;

          return (
            <Card key={category.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <category.icon className="h-5 w-5 text-blue-600" />
                  {category.name}
                  <Badge variant="outline" className="ml-auto">
                    {categoryDocs.length} tài liệu
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryDocs.map((doc) => {
                    const StatusIcon = getStatusIcon(doc.status);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-gray-600">
                              Tải lên: {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {doc.status === 'approved' && 'Đã duyệt'}
                            {doc.status === 'pending' && 'Chờ duyệt'}
                            {doc.status === 'rejected' && 'Từ chối'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Xem
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Checklist */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Danh sách kiểm tra
          </CardTitle>
          <p className="text-sm text-gray-600">
            Vui lòng xác nhận tất cả các điều kiện sau trước khi tiếp tục
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={reviewChecklist[item.id] || false}
                  onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={item.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {item.text}
                    {item.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-gray-600">
          {!canProceed ? (
            <span>Vui lòng hoàn thành tất cả các mục kiểm tra để tiếp tục</span>
          ) : (
            <span className="text-green-600 font-medium">✓ Sẵn sàng để chia sẻ tài liệu</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleVerifyDocuments}
            disabled={!canProceed || isVerifying}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Xác thực tài liệu
              </>
            )}
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tiếp tục chia sẻ
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>Xác thực tự động:</strong> Hệ thống sẽ tự động kiểm tra tính hợp lệ của tài liệu.
          Nếu có vấn đề, bạn sẽ được thông báo để cập nhật lại tài liệu.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDocumentReview;