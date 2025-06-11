
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import AddLoanModal from './AddLoanModal';

interface ExistingLoan {
  id: string;
  bank_name: string;
  loan_type: string;
  current_amount: number;
  remaining_amount: number;
  current_interest_rate: number;
  remaining_term_months: number;
  monthly_payment: number;
  original_loan_date: string;
  loan_purpose: string;
  created_at: string;
}

const ExistingLoansManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loans, setLoans] = useState<ExistingLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExistingLoans();
    }
  }, [user]);

  const fetchExistingLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('existing_loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (error) {
      console.error('Error fetching existing loans:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khoản vay hiện tại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    try {
      const { error } = await supabase
        .from('existing_loans')
        .delete()
        .eq('id', loanId);

      if (error) throw error;

      setLoans(loans.filter(loan => loan.id !== loanId));
      toast({
        title: "Thành công",
        description: "Đã xóa khoản vay khỏi danh sách",
      });
    } catch (error) {
      console.error('Error deleting loan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khoản vay",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            Vui lòng đăng nhập để xem danh sách khoản vay hiện tại
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Khoản vay hiện tại ({loans.length})
        </h2>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm khoản vay
        </Button>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có khoản vay nào
            </h3>
            <p className="text-gray-500 mb-4">
              Thêm thông tin các khoản vay hiện tại để nhận tư vấn tối ưu hóa
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              Thêm khoản vay đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{loan.bank_name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {loan.loan_type}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteLoan(loan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số dư còn lại:</span>
                    <span className="font-semibold text-brand-600">
                      {formatCurrency(loan.remaining_amount)} đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lãi suất:</span>
                    <span className="font-semibold">{loan.current_interest_rate}%/năm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trả hàng tháng:</span>
                    <span className="font-semibold">
                      {formatCurrency(loan.monthly_payment)} đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Còn lại:</span>
                    <span className="font-semibold">{loan.remaining_term_months} tháng</span>
                  </div>
                </div>

                {loan.loan_purpose && (
                  <div>
                    <span className="text-sm text-gray-600">Mục đích:</span>
                    <p className="text-sm mt-1">{loan.loan_purpose}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Ngày vay: {new Date(loan.original_loan_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddLoanModal 
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onLoanAdded={fetchExistingLoans}
      />
    </div>
  );
};

export default ExistingLoansManager;
