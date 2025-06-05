
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LoanRequest {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  term: number;
  location: string;
  creditScore: number;
  description: string;
  status: 'open' | 'in_negotiation' | 'approved' | 'closed';
  createdAt: string;
  offers: number;
}

interface CreateLoanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: LoanRequest) => void;
}

const CreateLoanRequestModal = ({ isOpen, onClose, onSubmit }: CreateLoanRequestModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    borrowerName: '',
    amount: '',
    purpose: '',
    term: '',
    location: '',
    creditScore: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.borrowerName || !formData.amount || !formData.purpose || !formData.location) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    const newRequest: LoanRequest = {
      id: `LR-${Date.now()}`,
      borrowerName: formData.borrowerName,
      amount: parseInt(formData.amount),
      purpose: formData.purpose,
      term: parseInt(formData.term) || 12,
      location: formData.location,
      creditScore: parseInt(formData.creditScore) || 700,
      description: formData.description,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      offers: 0
    };

    onSubmit(newRequest);
    
    // Reset form
    setFormData({
      borrowerName: '',
      amount: '',
      purpose: '',
      term: '',
      location: '',
      creditScore: '',
      description: ''
    });

    toast({
      title: "Thành công",
      description: "Yêu cầu vay của bạn đã được đăng thành công!",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đăng yêu cầu vay mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="borrowerName">Họ và tên *</Label>
            <Input
              id="borrowerName"
              value={formData.borrowerName}
              onChange={(e) => handleChange('borrowerName', e.target.value)}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Số tiền cần vay (VNĐ) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Ví dụ: 200000000"
              required
            />
          </div>

          <div>
            <Label htmlFor="purpose">Mục đích vay *</Label>
            <Select value={formData.purpose} onValueChange={(value) => handleChange('purpose', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mục đích vay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mua nhà">Mua nhà</SelectItem>
                <SelectItem value="Mua xe">Mua xe</SelectItem>
                <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                <SelectItem value="Học tập">Học tập</SelectItem>
                <SelectItem value="Y tế">Y tế</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="term">Thời hạn vay (tháng)</Label>
            <Input
              id="term"
              type="number"
              value={formData.term}
              onChange={(e) => handleChange('term', e.target.value)}
              placeholder="Ví dụ: 12"
            />
          </div>

          <div>
            <Label htmlFor="location">Khu vực *</Label>
            <Select value={formData.location} onValueChange={(value) => handleChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="creditScore">Điểm tín dụng (nếu biết)</Label>
            <Input
              id="creditScore"
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleChange('creditScore', e.target.value)}
              placeholder="Ví dụ: 750"
              min="300"
              max="850"
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả thêm về tình hình tài chính, mục đích sử dụng..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700">
              Đăng yêu cầu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLoanRequestModal;
