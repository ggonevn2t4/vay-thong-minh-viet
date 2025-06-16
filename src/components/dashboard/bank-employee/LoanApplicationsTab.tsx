
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RawLoanApplicationWithProfile, ReviewData } from '@/types/loan-applications';
import { fetchLoanApplications, submitLoanReview } from '@/services/loan-application-service';
import LoanApplicationCard from './LoanApplicationCard';
import LoanReviewForm from './LoanReviewForm';

const LoanApplicationsTab = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<RawLoanApplicationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<RawLoanApplicationWithProfile | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    review_status: 'pending',
    review_notes: '',
    approval_amount: '',
    approved_interest_rate: '',
    approved_term_months: '',
    conditions: ''
  });

  useEffect(() => {
    loadLoanApplications();
  }, []);

  const loadLoanApplications = async () => {
    try {
      const data = await fetchLoanApplications();
      setApplications(data);
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
      await submitLoanReview(selectedApp.id, user.id, reviewData);
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
      loadLoanApplications();
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Lỗi khi lưu đánh giá');
    }
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
            <LoanApplicationCard
              key={app.id}
              application={app}
              onClick={setSelectedApp}
            />
          ))}
        </div>

        {/* Review Form */}
        {selectedApp && (
          <LoanReviewForm
            selectedApp={selectedApp}
            reviewData={reviewData}
            onReviewDataChange={setReviewData}
            onSubmit={handleReview}
            onCancel={() => setSelectedApp(null)}
          />
        )}
      </div>
    </div>
  );
};

export default LoanApplicationsTab;
