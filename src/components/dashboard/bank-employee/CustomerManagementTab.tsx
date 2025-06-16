
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
import { User, Phone, Mail, Building, TrendingUp } from 'lucide-react';
import { CreditAssessment } from '@/types/bank-employee';

// Define a more flexible type for the raw Supabase response
interface RawSupabaseCustomer {
  id: string;
  full_name: string | null;
  phone: string | null;
  employment_type: string | null;
  monthly_income: number | null;
  company_name: string | null;
  created_at: string;
  loan_applications?: any;
  customer_credit_assessments?: any;
}

const CustomerManagementTab = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<RawSupabaseCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<RawSupabaseCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentData, setAssessmentData] = useState<CreditAssessment>({
    credit_score: 0,
    income_verification_status: 'pending',
    employment_verification_status: 'pending',
    debt_to_income_ratio: 0,
    risk_level: 'medium',
    assessment_notes: '',
    recommended_loan_amount: 0,
    recommended_interest_rate: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          loan_applications (
            id,
            amount,
            status,
            created_at
          ),
          customer_credit_assessments:customer_credit_assessments!customer_id (
            id,
            credit_score,
            risk_level,
            assessment_date
          )
        `)
        .not('full_name', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process and filter the data to handle errors and null values
      const processedCustomers = (data || []).filter(customer => {
        // Filter out customers with invalid data
        return customer && 
               typeof customer === 'object' && 
               customer.id &&
               customer.full_name;
      }).map(customer => ({
        ...customer,
        // Ensure arrays are properly handled
        loan_applications: Array.isArray(customer.loan_applications) ? customer.loan_applications : [],
        customer_credit_assessments: Array.isArray(customer.customer_credit_assessments) ? customer.customer_credit_assessments : []
      }));
      
      setCustomers(processedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    if (!selectedCustomer || !user) return;

    try {
      const { error } = await supabase
        .from('customer_credit_assessments')
        .insert({
          customer_id: selectedCustomer.id,
          assessor_id: user.id,
          ...assessmentData
        });

      if (error) throw error;

      toast.success('Đánh giá tín dụng đã được tạo thành công');
      setSelectedCustomer(null);
      setAssessmentData({
        credit_score: 0,
        income_verification_status: 'pending',
        employment_verification_status: 'pending',
        debt_to_income_ratio: 0,
        risk_level: 'medium',
        assessment_notes: '',
        recommended_loan_amount: 0,
        recommended_interest_rate: 0
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Lỗi khi tạo đánh giá tín dụng');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Thấp';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao';
      default:
        return level;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Danh sách khách hàng</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCustomer(customer)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{customer.full_name}</span>
                    </div>
                    {customer.customer_credit_assessments && customer.customer_credit_assessments.length > 0 && (
                      <Badge className={getRiskLevelColor(customer.customer_credit_assessments[0].risk_level)}>
                        {getRiskLevelText(customer.customer_credit_assessments[0].risk_level)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    
                    {customer.company_name && (
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span>{customer.company_name}</span>
                      </div>
                    )}
                    
                    {customer.monthly_income && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                        <span>{formatCurrency(customer.monthly_income)}/tháng</span>
                      </div>
                    )}
                    
                    {customer.loan_applications && customer.loan_applications.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {customer.loan_applications.length} đơn vay
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Details & Assessment */}
        {selectedCustomer && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Họ tên:</span> {selectedCustomer.full_name}
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <span className="font-medium">Điện thoại:</span> {selectedCustomer.phone}
                  </div>
                )}
                {selectedCustomer.employment_type && (
                  <div>
                    <span className="font-medium">Loại công việc:</span> {selectedCustomer.employment_type}
                  </div>
                )}
                {selectedCustomer.company_name && (
                  <div>
                    <span className="font-medium">Công ty:</span> {selectedCustomer.company_name}
                  </div>
                )}
                {selectedCustomer.monthly_income && (
                  <div>
                    <span className="font-medium">Thu nhập:</span> {formatCurrency(selectedCustomer.monthly_income)}/tháng
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đánh giá tín dụng mới</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Điểm tín dụng</label>
                    <Input
                      type="number"
                      value={assessmentData.credit_score}
                      onChange={(e) => setAssessmentData(prev => ({ 
                        ...prev, 
                        credit_score: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="300-850"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tỷ lệ nợ/thu nhập (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={assessmentData.debt_to_income_ratio}
                      onChange={(e) => setAssessmentData(prev => ({ 
                        ...prev, 
                        debt_to_income_ratio: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Xác minh thu nhập</label>
                    <Select 
                      value={assessmentData.income_verification_status}
                      onValueChange={(value) => setAssessmentData(prev => ({ 
                        ...prev, 
                        income_verification_status: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xác minh</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="rejected">Không hợp lệ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Xác minh công việc</label>
                    <Select 
                      value={assessmentData.employment_verification_status}
                      onValueChange={(value) => setAssessmentData(prev => ({ 
                        ...prev, 
                        employment_verification_status: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xác minh</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="rejected">Không hợp lệ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mức độ rủi ro</label>
                  <Select 
                    value={assessmentData.risk_level}
                    onValueChange={(value) => setAssessmentData(prev => ({ 
                      ...prev, 
                      risk_level: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Số tiền vay đề xuất</label>
                    <Input
                      type="number"
                      value={assessmentData.recommended_loan_amount}
                      onChange={(e) => setAssessmentData(prev => ({ 
                        ...prev, 
                        recommended_loan_amount: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Lãi suất đề xuất (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={assessmentData.recommended_interest_rate}
                      onChange={(e) => setAssessmentData(prev => ({ 
                        ...prev, 
                        recommended_interest_rate: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ghi chú đánh giá</label>
                  <Textarea
                    value={assessmentData.assessment_notes}
                    onChange={(e) => setAssessmentData(prev => ({ 
                      ...prev, 
                      assessment_notes: e.target.value 
                    }))}
                    placeholder="Nhập ghi chú đánh giá..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateAssessment} className="flex-1">
                    Lưu đánh giá
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagementTab;
