import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  Star
} from 'lucide-react';

interface CustomerInsightCardProps {
  customer: {
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
  };
  onViewDetails: (customer: any) => void;
  onStartConversation: (customer: any) => void;
}

const CustomerInsightCard = ({ customer, onViewDetails, onStartConversation }: CustomerInsightCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const getCustomerScore = () => {
    if (!customer.customer_credit_assessments?.length) return null;
    return customer.customer_credit_assessments[0].credit_score;
  };

  const getRiskLevel = () => {
    if (!customer.customer_credit_assessments?.length) return 'unknown';
    return customer.customer_credit_assessments[0].risk_level;
  };

  const getLoanSummary = () => {
    if (!customer.loan_applications?.length) return null;
    
    const total = customer.loan_applications.length;
    const approved = customer.loan_applications.filter(app => app.status === 'approved').length;
    const pending = customer.loan_applications.filter(app => app.status === 'pending').length;
    
    return { total, approved, pending };
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return 'Chưa đánh giá';
    }
  };

  const score = getCustomerScore();
  const riskLevel = getRiskLevel();
  const loanSummary = getLoanSummary();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{customer.full_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Khách hàng từ {new Date(customer.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          <Badge className={getRiskLevelColor(riskLevel)}>
            {getRiskLevelText(riskLevel)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.company_name && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{customer.company_name}</span>
            </div>
          )}
        </div>

        {/* Financial Overview */}
        {customer.monthly_income && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Thu nhập hàng tháng</span>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(customer.monthly_income)}
            </p>
          </div>
        )}

        {/* Credit Score */}
        {score && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Điểm tín dụng</span>
              <span className="text-sm font-bold">{score}/850</span>
            </div>
            <Progress value={(score / 850) * 100} className="h-2" />
          </div>
        )}

        {/* Loan Applications Summary */}
        {loanSummary && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-sm text-blue-600 font-medium">{loanSummary.total}</div>
              <div className="text-xs text-blue-500">Tổng đơn</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-sm text-green-600 font-medium">{loanSummary.approved}</div>
              <div className="text-xs text-green-500">Đã duyệt</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="text-sm text-yellow-600 font-medium">{loanSummary.pending}</div>
              <div className="text-xs text-yellow-500">Chờ duyệt</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(customer)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Chi tiết
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onStartConversation(customer)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Nhắn tin
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInsightCard;