import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Share2, 
  Shield, 
  Clock, 
  Users, 
  Calendar,
  Lock,
  Eye,
  Mail,
  Phone,
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface LegalDocumentSharingProps {
  onSharingComplete: () => void;
  onNext: () => void;
}

const LegalDocumentSharing: React.FC<LegalDocumentSharingProps> = ({ 
  onSharingComplete, 
  onNext 
}) => {
  const { user } = useAuth();
  const { documents } = useDocuments();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [sharingSettings, setSharingSettings] = useState({
    accessDuration: '7', // days
    allowDownload: false,
    allowPrint: false,
    viewOnly: true,
    notifyAccess: true,
    recipientType: 'bank',
    bankName: '',
    advisorEmail: '',
    additionalNotes: ''
  });
  const [isSharing, setIsSharing] = useState(false);

  const legalDocuments = documents.filter(doc => 
    doc.category === 'legal' || doc.category === 'identity' || doc.category === 'income'
  );

  const bankOptions = [
    { value: 'vietcombank', name: 'Vietcombank' },
    { value: 'techcombank', name: 'Techcombank' },
    { value: 'bidv', name: 'BIDV' },
    { value: 'agribank', name: 'Agribank' },
    { value: 'mb', name: 'MB Bank' },
    { value: 'acb', name: 'ACB' },
    { value: 'sacombank', name: 'Sacombank' },
    { value: 'vpbank', name: 'VPBank' }
  ];

  const accessDurationOptions = [
    { value: '3', label: '3 ngày' },
    { value: '7', label: '7 ngày' },
    { value: '14', label: '14 ngày' },
    { value: '30', label: '30 ngày' }
  ];

  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === legalDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(legalDocuments.map(doc => doc.id));
    }
  };

  const handleSharingSettingChange = (key: string, value: any) => {
    setSharingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleShareDocuments = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Vui lòng chọn ít nhất một tài liệu để chia sẻ');
      return;
    }

    if (sharingSettings.recipientType === 'bank' && !sharingSettings.bankName) {
      toast.error('Vui lòng chọn ngân hàng');
      return;
    }

    if (sharingSettings.recipientType === 'advisor' && !sharingSettings.advisorEmail) {
      toast.error('Vui lòng nhập email tư vấn viên');
      return;
    }

    setIsSharing(true);
    
    try {
      // Simulate API call to create document sharing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally call your API to create document sharing records
      // const sharingData = {
      //   customer_id: user?.id,
      //   document_ids: selectedDocuments,
      //   sharing_settings: sharingSettings,
      //   expires_at: new Date(Date.now() + parseInt(sharingSettings.accessDuration) * 24 * 60 * 60 * 1000)
      // };

      onSharingComplete();
      toast.success('Chia sẻ tài liệu thành công!');
    } catch (error) {
      console.error('Sharing error:', error);
      toast.error('Không thể chia sẻ tài liệu');
    } finally {
      setIsSharing(false);
    }
  };

  const selectedCount = selectedDocuments.length;
  const allSelected = selectedCount === legalDocuments.length;

  return (
    <div className="space-y-6">
      {/* Sharing Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Chia sẻ tài liệu pháp lý
          </CardTitle>
          <p className="text-sm text-gray-600">
            Chia sẻ tài liệu một cách an toàn với ngân hàng hoặc tư vấn viên của bạn
          </p>
        </CardHeader>
      </Card>

      {/* Document Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Chọn tài liệu chia sẻ
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {selectedCount}/{legalDocuments.length} đã chọn
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {legalDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) => handleDocumentSelect(doc.id, checked as boolean)}
                  />
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-600">
                        {doc.category} • Tải lên: {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {doc.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recipient Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Người nhận
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại người nhận</Label>
              <Select 
                value={sharingSettings.recipientType} 
                onValueChange={(value) => handleSharingSettingChange('recipientType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Ngân hàng
                    </div>
                  </SelectItem>
                  <SelectItem value="advisor">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tư vấn viên
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sharingSettings.recipientType === 'bank' ? (
              <div className="space-y-2">
                <Label>Chọn ngân hàng</Label>
                <Select 
                  value={sharingSettings.bankName} 
                  onValueChange={(value) => handleSharingSettingChange('bankName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngân hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Email tư vấn viên</Label>
                <Input
                  type="email"
                  placeholder="advisor@example.com"
                  value={sharingSettings.advisorEmail}
                  onChange={(e) => handleSharingSettingChange('advisorEmail', e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Access Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-600" />
            Cài đặt quyền truy cập
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thời hạn truy cập</Label>
              <Select 
                value={sharingSettings.accessDuration} 
                onValueChange={(value) => handleSharingSettingChange('accessDuration', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="viewOnly"
                checked={sharingSettings.viewOnly}
                onCheckedChange={(checked) => handleSharingSettingChange('viewOnly', checked)}
              />
              <Label htmlFor="viewOnly" className="text-sm">
                Chỉ cho phép xem (không tải xuống)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowDownload"
                checked={sharingSettings.allowDownload}
                onCheckedChange={(checked) => handleSharingSettingChange('allowDownload', checked)}
                disabled={sharingSettings.viewOnly}
              />
              <Label htmlFor="allowDownload" className="text-sm">
                Cho phép tải xuống
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyAccess"
                checked={sharingSettings.notifyAccess}
                onCheckedChange={(checked) => handleSharingSettingChange('notifyAccess', checked)}
              />
              <Label htmlFor="notifyAccess" className="text-sm">
                Thông báo khi có người truy cập
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú bổ sung (tùy chọn)</Label>
            <Textarea
              placeholder="Thêm ghi chú cho người nhận..."
              value={sharingSettings.additionalNotes}
              onChange={(e) => handleSharingSettingChange('additionalNotes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-gray-600">
          {selectedCount === 0 ? (
            <span>Vui lòng chọn ít nhất một tài liệu để chia sẻ</span>
          ) : (
            <span className="text-green-600 font-medium">
              ✓ Đã chọn {selectedCount} tài liệu để chia sẻ
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleShareDocuments}
            disabled={selectedCount === 0 || isSharing}
          >
            {isSharing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Đang chia sẻ...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ ngay
              </>
            )}
          </Button>
          
          <Button
            onClick={onNext}
            disabled={selectedCount === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Xem trạng thái
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-purple-200 bg-purple-50">
        <Shield className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-700">
          <strong>Bảo mật cao:</strong> Tài liệu được mã hóa đầu cuối và có thời hạn truy cập tự động.
          Bạn có thể thu hồi quyền truy cập bất cứ lúc nào.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDocumentSharing;