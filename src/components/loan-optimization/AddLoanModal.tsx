
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddLoanModalProps {
  open: boolean;
  onClose: () => void;
  onLoanAdded: () => void;
}

const AddLoanModal = ({ open, onClose, onLoanAdded }: AddLoanModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    loan_type: '',
    current_amount: '',
    remaining_amount: '',
    current_interest_rate: '',
    remaining_term_months: '',
    monthly_payment: '',
    original_loan_date: '',
    loan_purpose: '',
    has_promotional_period: false,
    promotional_rate: '',
    promotional_end_date: '',
    post_promotional_rate: '',
  });

  const loanTypes = [
    'Vay tiêu dùng',
    'Vay thế chấp',
    'Vay mua xe',
    'Vay kinh doanh',
    'Vay tín chấp',
    'Vay mua nhà',
    'Khác'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const loanData: any = {
        user_id: user.id,
        bank_name: formData.bank_name,
        loan_type: formData.loan_type,
        current_amount: parseFloat(formData.current_amount),
        remaining_amount: parseFloat(formData.remaining_amount),
        current_interest_rate: parseFloat(formData.current_interest_rate),
        remaining_term_months: parseInt(formData.remaining_term_months),
        monthly_payment: parseFloat(formData.monthly_payment),
        original_loan_date: formData.original_loan_date,
        loan_purpose: formData.loan_purpose,
        has_promotional_period: formData.has_promotional_period,
      };

      if (formData.has_promotional_period) {
        loanData.promotional_rate = parseFloat(formData.promotional_rate);
        loanData.promotional_end_date = formData.promotional_end_date;
        loanData.post_promotional_rate = parseFloat(formData.post_promotional_rate);
      }

      const { error } = await supabase
        .from('existing_loans')
        .insert(loanData);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã thêm khoản vay vào danh sách",
      });

      // Reset form
      setFormData({
        bank_name: '',
        loan_type: '',
        current_amount: '',
        remaining_amount: '',
        current_interest_rate: '',
        remaining_term_months: '',
        monthly_payment: '',
        original_loan_date: '',
        loan_purpose: '',
        has_promotional_period: false,
        promotional_rate: '',
        promotional_end_date: '',
        post_promotional_rate: '',
      });

      onLoanAdded();
      onClose();
    } catch (error) {
      console.error('Error adding loan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm khoản vay",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm khoản vay hiện tại</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank_name">Ngân hàng *</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                placeholder="Vietcombank, BIDV, Techcombank..."
                required
              />
            </div>

            <div>
              <Label htmlFor="loan_type">Loại khoản vay *</Label>
              <Select value={formData.loan_type} onValueChange={(value) => handleInputChange('loan_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khoản vay" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_amount">Số tiền vay ban đầu (VNĐ) *</Label>
              <Input
                id="current_amount"
                type="number"
                value={formData.current_amount}
                onChange={(e) => handleInputChange('current_amount', e.target.value)}
                placeholder="100000000"
                required
              />
            </div>

            <div>
              <Label htmlFor="remaining_amount">Số dư còn lại (VNĐ) *</Label>
              <Input
                id="remaining_amount"
                type="number"
                value={formData.remaining_amount}
                onChange={(e) => handleInputChange('remaining_amount', e.target.value)}
                placeholder="50000000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_interest_rate">Lãi suất hiện tại (%/năm) *</Label>
              <Input
                id="current_interest_rate"
                type="number"
                step="0.01"
                value={formData.current_interest_rate}
                onChange={(e) => handleInputChange('current_interest_rate', e.target.value)}
                placeholder="12.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="monthly_payment">Trả hàng tháng (VNĐ) *</Label>
              <Input
                id="monthly_payment"
                type="number"
                value={formData.monthly_payment}
                onChange={(e) => handleInputChange('monthly_payment', e.target.value)}
                placeholder="5000000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="remaining_term_months">Số tháng còn lại *</Label>
              <Input
                id="remaining_term_months"
                type="number"
                value={formData.remaining_term_months}
                onChange={(e) => handleInputChange('remaining_term_months', e.target.value)}
                placeholder="24"
                required
              />
            </div>

            <div>
              <Label htmlFor="original_loan_date">Ngày vay ban đầu</Label>
              <Input
                id="original_loan_date"
                type="date"
                value={formData.original_loan_date}
                onChange={(e) => handleInputChange('original_loan_date', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_promotional_period"
              checked={formData.has_promotional_period}
              onCheckedChange={(checked) => handleInputChange('has_promotional_period', checked as boolean)}
            />
            <Label htmlFor="has_promotional_period">Khoản vay có giai đoạn ưu đãi</Label>
          </div>

          {formData.has_promotional_period && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-900">Thông tin giai đoạn ưu đãi</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promotional_rate">Lãi suất ưu đãi (%/năm) *</Label>
                  <Input
                    id="promotional_rate"
                    type="number"
                    step="0.01"
                    value={formData.promotional_rate}
                    onChange={(e) => handleInputChange('promotional_rate', e.target.value)}
                    placeholder="8.5"
                    required={formData.has_promotional_period}
                  />
                </div>

                <div>
                  <Label htmlFor="promotional_end_date">Ngày kết thúc ưu đãi *</Label>
                  <Input
                    id="promotional_end_date"
                    type="date"
                    value={formData.promotional_end_date}
                    onChange={(e) => handleInputChange('promotional_end_date', e.target.value)}
                    required={formData.has_promotional_period}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="post_promotional_rate">Lãi suất sau ưu đãi (%/năm) *</Label>
                <Input
                  id="post_promotional_rate"
                  type="number"
                  step="0.01"
                  value={formData.post_promotional_rate}
                  onChange={(e) => handleInputChange('post_promotional_rate', e.target.value)}
                  placeholder="15.5"
                  required={formData.has_promotional_period}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="loan_purpose">Mục đích vay</Label>
            <Textarea
              id="loan_purpose"
              value={formData.loan_purpose}
              onChange={(e) => handleInputChange('loan_purpose', e.target.value)}
              placeholder="Mua nhà, kinh doanh, tiêu dùng..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm khoản vay'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLoanModal;
