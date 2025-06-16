
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RawLoanApplicationWithProfile, ReviewData, LoanStatus } from '@/types/loan-applications';
import { formatCurrency, getCustomerName } from '@/utils/loan-application-utils';

interface LoanReviewFormProps {
  selectedApp: RawLoanApplicationWithProfile;
  reviewData: ReviewData;
  onReviewDataChange: (data: ReviewData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const LoanReviewForm = ({
  selectedApp,
  reviewData,
  onReviewDataChange,
  onSubmit,
  onCancel
}: LoanReviewFormProps) => {
  const updateReviewData = (field: keyof ReviewData, value: string | LoanStatus) => {
    onReviewDataChange({ ...reviewData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá đơn vay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Thông tin đơn vay</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <p><strong>Khách hàng:</strong> {getCustomerName(selectedApp)}</p>
            <p><strong>Số tiền:</strong> {formatCurrency(selectedApp.amount)}</p>
            <p><strong>Thời hạn:</strong> {selectedApp.term_months} tháng</p>
            <p><strong>Mục đích:</strong> {selectedApp.purpose || 'Chưa cung cấp'}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kết quả đánh giá</label>
          <Select 
            value={reviewData.review_status} 
            onValueChange={(value: LoanStatus) => updateReviewData('review_status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="approved">Phê duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
              <SelectItem value="reviewing">Cần bổ sung hồ sơ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reviewData.review_status === 'approved' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Số tiền phê duyệt</label>
              <Input
                type="number"
                value={reviewData.approval_amount}
                onChange={(e) => updateReviewData('approval_amount', e.target.value)}
                placeholder="Nhập số tiền phê duyệt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lãi suất (%)</label>
              <Input
                type="number"
                step="0.01"
                value={reviewData.approved_interest_rate}
                onChange={(e) => updateReviewData('approved_interest_rate', e.target.value)}
                placeholder="Nhập lãi suất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thời hạn (tháng)</label>
              <Input
                type="number"
                value={reviewData.approved_term_months}
                onChange={(e) => updateReviewData('approved_term_months', e.target.value)}
                placeholder="Nhập thời hạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Điều kiện kèm theo</label>
              <Textarea
                value={reviewData.conditions}
                onChange={(e) => updateReviewData('conditions', e.target.value)}
                placeholder="Nhập các điều kiện kèm theo (nếu có)"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Ghi chú đánh giá</label>
          <Textarea
            value={reviewData.review_notes}
            onChange={(e) => updateReviewData('review_notes', e.target.value)}
            placeholder="Nhập ghi chú đánh giá"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onSubmit} className="flex-1">
            Lưu đánh giá
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanReviewForm;
