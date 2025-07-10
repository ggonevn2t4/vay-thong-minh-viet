import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    company_name?: string;
    monthly_income?: number;
    employment_type?: string;
    created_at: string;
    date_of_birth?: string;
    permanent_address_city?: string;
    permanent_address_district?: string;
    loan_applications?: any[];
    customer_credit_assessments?: any[];
  };
  onClose: () => void;
  onStartConversation: (customer: any) => void;
}

const CustomerDetailModal = ({ customer, onClose, onStartConversation }: CustomerDetailModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getEmploymentTypeText = (type: string) => {
    const types = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'freelancer': 'Tự do',
      'business_owner': 'Chủ doanh nghiệp',
      'unemployed': 'Thất nghiệp'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'pending': return 'Chờ duyệt';
      case 'reviewing': return 'Đang xem xét';
      default: return status;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const latestAssessment = customer.customer_credit_assessments?.[0];
  const creditScore = latestAssessment?.credit_score;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{customer.full_name}</h2>
              <p className="text-sm text-muted-foreground">
                Khách hàng từ {formatDate(customer.created_at)}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="loans">Khoản vay</TabsTrigger>
            <TabsTrigger value="assessment">Đánh giá</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Họ tên:</span>
                    <span>{customer.full_name}</span>
                  </div>
                  
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Điện thoại:</span>
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{customer.email}</span>
                    </div>
                  )}
                  
                  {customer.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Ngày sinh:</span>
                      <span>{formatDate(customer.date_of_birth)}</span>
                    </div>
                  )}
                  
                  {(customer.permanent_address_city || customer.permanent_address_district) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Địa chỉ:</span>
                      <span>
                        {customer.permanent_address_district && `${customer.permanent_address_district}, `}
                        {customer.permanent_address_city}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Employment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin nghề nghiệp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.employment_type && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Loại công việc:</span>
                      <Badge variant="outline">
                        {getEmploymentTypeText(customer.employment_type)}
                      </Badge>
                    </div>
                  )}
                  
                  {customer.company_name && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Công ty:</span>
                      <span>{customer.company_name}</span>
                    </div>
                  )}
                  
                  {customer.monthly_income && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Thu nhập hàng tháng:</span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(customer.monthly_income)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Credit Score */}
            {creditScore && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Điểm tín dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{creditScore}/850</span>
                      <Badge className={getRiskLevelColor(latestAssessment.risk_level)}>
                        Rủi ro {getRiskLevelText(latestAssessment.risk_level)}
                      </Badge>
                    </div>
                    <Progress value={(creditScore / 850) * 100} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Đánh giá lần cuối: {formatDate(latestAssessment.assessment_date)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <div className="space-y-3">
              {customer.loan_applications && customer.loan_applications.length > 0 ? (
                customer.loan_applications.map((loan, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{loan.loan_type || 'Vay tín chấp'}</span>
                            <Badge className={getStatusColor(loan.status)}>
                              {getStatusText(loan.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Số tiền: {formatCurrency(loan.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ngày đăng ký: {formatDate(loan.created_at)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có đơn vay nào
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            {latestAssessment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đánh giá tín dụng chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Điểm tín dụng</span>
                      <p className="text-2xl font-bold">{latestAssessment.credit_score}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Mức độ rủi ro</span>
                      <Badge className={getRiskLevelColor(latestAssessment.risk_level)}>
                        {getRiskLevelText(latestAssessment.risk_level)}
                      </Badge>
                    </div>
                  </div>
                  
                  {latestAssessment.recommended_loan_amount && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Số tiền vay đề xuất</span>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(latestAssessment.recommended_loan_amount)}
                      </p>
                    </div>
                  )}
                  
                  {latestAssessment.recommended_interest_rate && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Lãi suất đề xuất</span>
                      <p className="text-lg font-semibold">
                        {latestAssessment.recommended_interest_rate}% / năm
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Ngày đánh giá</span>
                    <p>{formatDate(latestAssessment.assessment_date)}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có đánh giá tín dụng nào
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Chưa có tài liệu nào được tải lên
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={() => onStartConversation(customer)} className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Bắt đầu trò chuyện
          </Button>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;