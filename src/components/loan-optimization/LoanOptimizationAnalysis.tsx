
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface ExistingLoan {
  id: string;
  bank_name: string;
  loan_type: string;
  remaining_amount: number;
  current_interest_rate: number;
  monthly_payment: number;
  remaining_term_months: number;
}

interface OptimizationAnalysis {
  id: string;
  existing_loan_id: string;
  current_loan_cost: any;
  optimization_recommendations: any;
  potential_savings: any;
  ai_confidence_score: number;
  status: string;
  created_at: string;
}

const LoanOptimizationAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loans, setLoans] = useState<ExistingLoan[]>([]);
  const [analyses, setAnalyses] = useState<OptimizationAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch existing loans
      const { data: loansData, error: loansError } = await supabase
        .from('existing_loans')
        .select('*');

      if (loansError) throw loansError;

      // Fetch optimization analyses
      const { data: analysesData, error: analysesError } = await supabase
        .from('loan_optimization_analysis')
        .select('*')
        .order('created_at', { ascending: false });

      if (analysesError) throw analysesError;

      setLoans(loansData || []);
      setAnalyses(analysesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu phân tích",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const performAnalysis = async (loanId: string) => {
    if (!user) return;

    setAnalyzing(loanId);
    try {
      // Simulate AI analysis (in real implementation, this would call an AI service)
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      // Mock analysis data
      const mockAnalysis = {
        user_id: user.id,
        existing_loan_id: loanId,
        current_loan_cost: {
          total_remaining_cost: loan.monthly_payment * loan.remaining_term_months,
          total_interest: (loan.monthly_payment * loan.remaining_term_months) - loan.remaining_amount,
          effective_rate: loan.current_interest_rate
        },
        optimization_recommendations: {
          recommended_actions: [
            'Cân nhắc tái cấu trúc nợ với lãi suất thấp hơn',
            'Tìm kiếm các gói vay ưu đãi từ ngân hàng khác',
            'Xem xét trả nợ trước hạn nếu có điều kiện'
          ],
          best_alternative_rate: Math.max(6, loan.current_interest_rate - 2),
          refinance_benefits: true
        },
        potential_savings: {
          monthly_savings: Math.round(loan.monthly_payment * 0.15),
          total_savings: Math.round(loan.monthly_payment * loan.remaining_term_months * 0.2),
          time_savings_months: Math.round(loan.remaining_term_months * 0.1)
        },
        ai_confidence_score: 0.85,
        status: 'completed'
      };

      const { error } = await supabase
        .from('loan_optimization_analysis')
        .insert(mockAnalysis);

      if (error) throw error;

      toast({
        title: "Phân tích hoàn thành",
        description: "Đã tạo báo cáo tối ưu hóa cho khoản vay của bạn",
      });

      fetchData();
    } catch (error) {
      console.error('Error performing analysis:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện phân tích",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(null);
    }
  };

  const getAnalysisForLoan = (loanId: string) => {
    return analyses.find(a => a.existing_loan_id === loanId);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            Vui lòng đăng nhập để xem phân tích tối ưu hóa
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Phân tích tối ưu hóa
        </h2>
        <p className="text-gray-600">
          Phân tích AI để tìm cơ hội tối ưu hóa các khoản vay hiện tại
        </p>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có khoản vay để phân tích
            </h3>
            <p className="text-gray-500">
              Thêm thông tin khoản vay hiện tại để nhận phân tích tối ưu hóa
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {loans.map((loan) => {
            const analysis = getAnalysisForLoan(loan.id);
            const isAnalyzing = analyzing === loan.id;

            return (
              <Card key={loan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {loan.bank_name} - {loan.loan_type}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Số dư: {formatCurrency(loan.remaining_amount)} đ | 
                        Lãi suất: {loan.current_interest_rate}%/năm
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis && (
                        <Badge 
                          variant={analysis.status === 'completed' ? 'default' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Đã phân tích
                        </Badge>
                      )}
                      <Button
                        onClick={() => performAnalysis(loan.id)}
                        disabled={isAnalyzing}
                        size="sm"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Đang phân tích...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {analysis ? 'Phân tích lại' : 'Phân tích'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {analysis && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Current Loan Cost */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Chi phí hiện tại</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tổng chi phí còn lại:</span>
                            <span className="font-medium">
                              {formatCurrency(analysis.current_loan_cost?.total_remaining_cost || 0)} đ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tổng tiền lãi:</span>
                            <span className="font-medium text-red-600">
                              {formatCurrency(analysis.current_loan_cost?.total_interest || 0)} đ
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Potential Savings */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Tiềm năng tiết kiệm</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tiết kiệm hàng tháng:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(analysis.potential_savings?.monthly_savings || 0)} đ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tổng tiết kiệm:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(analysis.potential_savings?.total_savings || 0)} đ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rút ngắn thời gian:</span>
                            <span className="font-medium">
                              {analysis.potential_savings?.time_savings_months || 0} tháng
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Khuyến nghị</h4>
                      <div className="space-y-2">
                        {analysis.optimization_recommendations?.recommended_actions?.map((action: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Độ tin cậy AI:</span>
                      <Badge variant="outline">
                        {Math.round(analysis.ai_confidence_score * 100)}%
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoanOptimizationAnalysis;
