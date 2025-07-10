import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CustomerFilters, { CustomerFilters as FilterType } from './CustomerFilters';
import CustomerInsightCard from './CustomerInsightCard';
import CustomerDetailModal from './CustomerDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  List, 
  Download, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Customer {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  company_name?: string;
  monthly_income?: number;
  employment_type?: string;
  created_at: string;
  loan_applications?: any[];
  customer_credit_assessments?: any[];
}

const EnhancedCustomerManagement = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    riskLevel: [],
    creditScoreRange: [300, 850],
    incomeRange: [0, 100000000],
    loanStatus: [],
    employmentType: [],
    hasActiveLoans: null,
    joinedDateRange: 'all'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          loan_applications (
            id,
            amount,
            status,
            created_at,
            loan_type
          ),
          customer_credit_assessments:customer_credit_assessments!customer_id (
            id,
            credit_score,
            risk_level,
            assessment_date,
            recommended_loan_amount,
            recommended_interest_rate
          )
        `)
        .not('full_name', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedCustomers = (data || []).filter(customer => {
        return customer && 
               typeof customer === 'object' && 
               customer.id &&
               customer.full_name;
      }).map(customer => ({
        ...customer,
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

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          customer.full_name?.toLowerCase().includes(searchTerm) ||
          customer.phone?.includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm) ||
          customer.company_name?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Risk level filter
      if (filters.riskLevel.length > 0) {
        const customerRiskLevel = customer.customer_credit_assessments?.[0]?.risk_level;
        if (!customerRiskLevel || !filters.riskLevel.includes(customerRiskLevel)) {
          return false;
        }
      }

      // Credit score filter
      const creditScore = customer.customer_credit_assessments?.[0]?.credit_score;
      if (creditScore && (creditScore < filters.creditScoreRange[0] || creditScore > filters.creditScoreRange[1])) {
        return false;
      }

      // Income filter
      if (customer.monthly_income && (customer.monthly_income < filters.incomeRange[0] || customer.monthly_income > filters.incomeRange[1])) {
        return false;
      }

      // Employment type filter
      if (filters.employmentType.length > 0 && customer.employment_type) {
        if (!filters.employmentType.includes(customer.employment_type)) {
          return false;
        }
      }

      // Loan status filter
      if (filters.loanStatus.length > 0) {
        const hasMatchingStatus = customer.loan_applications?.some(app => 
          filters.loanStatus.includes(app.status)
        );
        if (!hasMatchingStatus) return false;
      }

      // Active loans filter
      if (filters.hasActiveLoans !== null) {
        const hasActiveLoans = customer.loan_applications?.some(app => 
          ['approved', 'reviewing'].includes(app.status)
        );
        if (filters.hasActiveLoans && !hasActiveLoans) return false;
        if (!filters.hasActiveLoans && hasActiveLoans) return false;
      }

      // Date range filter
      if (filters.joinedDateRange !== 'all') {
        const joinedDate = new Date(customer.created_at);
        const now = new Date();
        
        switch (filters.joinedDateRange) {
          case 'today':
            if (joinedDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (joinedDate < weekAgo) return false;
            break;
          case 'month':
            if (joinedDate.getMonth() !== now.getMonth() || joinedDate.getFullYear() !== now.getFullYear()) return false;
            break;
          case 'quarter':
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            if (joinedDate < quarterStart) return false;
            break;
          case 'year':
            if (joinedDate.getFullYear() !== now.getFullYear()) return false;
            break;
        }
      }

      return true;
    });
  }, [customers, filters]);

  const getStatsData = () => {
    const total = customers.length;
    const highRisk = customers.filter(c => c.customer_credit_assessments?.[0]?.risk_level === 'high').length;
    const activeLoans = customers.filter(c => 
      c.loan_applications?.some(app => ['approved', 'reviewing'].includes(app.status))
    ).length;
    const newThisMonth = customers.filter(c => {
      const created = new Date(c.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return { total, highRisk, activeLoans, newThisMonth };
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleStartConversation = (customer: Customer) => {
    // Navigate to messaging with this customer
    toast.info(`Bắt đầu cuộc trò chuyện với ${customer.full_name}`);
  };

  const handleExportData = () => {
    toast.info('Xuất dữ liệu khách hàng...');
  };

  const stats = getStatsData();

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                <p className="text-sm text-muted-foreground">Mới tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeLoans}</p>
                <p className="text-sm text-muted-foreground">Có khoản vay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.highRisk}</p>
                <p className="text-sm text-muted-foreground">Rủi ro cao</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <CustomerFilters
        onFiltersChange={setFilters}
        totalCustomers={customers.length}
        filteredCount={filteredCustomers.length}
      />

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {filteredCustomers.length} khách hàng
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <CustomerInsightCard
              key={customer.id}
              customer={customer}
              onViewDetails={handleViewDetails}
              onStartConversation={handleStartConversation}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleViewDetails(customer)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.full_name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {customer.customer_credit_assessments?.[0] && (
                      <Badge variant="outline">
                        Điểm: {customer.customer_credit_assessments[0].credit_score}
                      </Badge>
                    )}
                    {customer.loan_applications?.length > 0 && (
                      <Badge variant="secondary">
                        {customer.loan_applications.length} đơn vay
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onStartConversation={handleStartConversation}
        />
      )}
    </div>
  );
};

export default EnhancedCustomerManagement;