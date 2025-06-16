
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LoanApplication {
  id: string;
  amount: number;
  term_months: number;
  loan_type: string;
  status: string;
  monthly_income: number;
  employment_type: string;
  purpose: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    phone: string;
  };
}

const LoanApplicationsTab = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [reviewData, setReviewData] = useState({
    review_status: 'pending',
    review_notes: '',
    approval_amount: '',
    approved_interest_rate: '',
    approved_term_months: '',
    conditions: ''
  });

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  const fetchLoanApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      toast.error('Lỗi khi tải danh sách đơn vay');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedApp || !user) return;

    try {
      const { error } = await supabase
        .from('loan_application_reviews')
        .insert({
          loan_application_id: selectedApp.id,
          reviewer_id: user.id,
          review_status: reviewData.review_status,
          review_notes: reviewData.review_notes,
          approval_amount: reviewData.approval_amount ? parseInt(reviewData.approval_amount) : null,
          approved_interest_rate: reviewData.approved_interest_rate ? parseFloat(reviewData.approved_interest_rate) : null,
          approved_term_months: reviewData.approved_term_months ? parseInt(reviewData.approved_term_months) : null,
          conditions: reviewData.conditions
        });

      if (error) throw error;

      // Update loan application status
      await supabase
        .from('loan_applications')
        .update({ status: reviewData.review_status })
        .eq('id', selectedApp.id);

      toast.success('Đánh giá đã được lưu thành công');
      setSelectedApp(null);
      setReviewData({
        review_status: 'pending',
        review_notes: '',
        approval_amount: '',
        approved_interest_rate: '',
        approved_term_months: '',
        conditions: ''
      });
      fetchLoanApplications();
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Lỗi khi lưu đánh giá');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
        return 'Chờ duyệt';
      case 'reviewing':
        return 'Đang xem xét';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Danh sách đơn vay</h3>
          {applications.map((app) => (
            <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedApp(app)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{app.profiles?.full_name || 'Khách hàng'}</p>
                    <p className="text-sm text-gray-600">{app.profiles?.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    <Badge variant="outline">{getStatusText(app.status)}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Số tiền:</span>
                    <p className="font-medium">{formatCurrency(app.amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Thời hạn:</span>
                    <p className="font-medium">{app.term_months} tháng</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại vay:</span>
                    <p className="font-medium">{app.loan_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Thu nhập:</span>
                    <p className="font-medium">{formatCurrency(app.monthly_income || 0)}/tháng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Form */}
        {selectedApp && (
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá đơn vay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Thông tin đơn vay</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <p><strong>Khách hàng:</strong> {selectedApp.profiles?.full_name}</p>
                  <p><strong>Số tiền:</strong> {formatCurrency(selectedApp.amount)}</p>
                  <p><strong>Thời hạn:</strong> {selectedApp.term_months} tháng</p>
                  <p><strong>Mục đích:</strong> {selectedApp.purpose}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kết quả đánh giá</label>
                <Select value={reviewData.review_status} onValueChange={(value) => 
                  setReviewData(prev => ({ ...prev, review_status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="approved">Phê duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                    <SelectItem value="requires_documents">Cần bổ sung hồ sơ</SelectItem>
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
                      onChange={(e) => setReviewData(prev => ({ ...prev, approval_amount: e.target.value }))}
                      placeholder="Nhập số tiền phê duyệt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Lãi suất (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={reviewData.approved_interest_rate}
                      onChange={(e) => setReviewData(prev => ({ ...prev, approved_interest_rate: e.target.value }))}
                      placeholder="Nhập lãi suất"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Thời hạn (tháng)</label>
                    <Input
                      type="number"
                      value={reviewData.approved_term_months}
                      onChange={(e) => setReviewData(prev => ({ ...prev, approved_term_months: e.target.value }))}
                      placeholder="Nhập thời hạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Điều kiện kèm theo</label>
                    <Textarea
                      value={reviewData.conditions}
                      onChange={(e) => setReviewData(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder="Nhập các điều kiện kèm theo (nếu có)"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Ghi chú đánh giá</label>
                <Textarea
                  value={reviewData.review_notes}
                  onChange={(e) => setReviewData(prev => ({ ...prev, review_notes: e.target.value }))}
                  placeholder="Nhập ghi chú đánh giá"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleReview} className="flex-1">
                  Lưu đánh giá
                </Button>
                <Button variant="outline" onClick={() => setSelectedApp(null)}>
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationsTab;
