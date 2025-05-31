
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingDown, Bell, Calculator, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanStatus {
  id: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  submittedDate: string;
  expectedDecision: string;
  interestRate?: number;
  notes: string;
}

interface PaymentReminder {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  type: 'principal' | 'interest' | 'full';
  status: 'pending' | 'paid' | 'overdue';
}

const SmartLoanTracker = () => {
  const { toast } = useToast();
  
  const [loanApplications] = useState<LoanStatus[]>([
    {
      id: '1',
      bankName: 'Vietcombank',
      amount: 500000000,
      status: 'in-review',
      submittedDate: '2024-01-15',
      expectedDecision: '2024-01-20',
      interestRate: 8.5,
      notes: 'Đã nộp đầy đủ hồ sơ, đang chờ thẩm định'
    },
    {
      id: '2',
      bankName: 'Techcombank',
      amount: 500000000,
      status: 'pending',
      submittedDate: '2024-01-18',
      expectedDecision: '2024-01-25',
      notes: 'Cần bổ sung giấy tờ thu nhập'
    },
    {
      id: '3',
      bankName: 'TPBank',
      amount: 300000000,
      status: 'approved',
      submittedDate: '2024-01-10',
      expectedDecision: '2024-01-17',
      interestRate: 9.2,
      notes: 'Đã được phê duyệt, chuẩn bị ký hợp đồng'
    }
  ]);

  const [paymentReminders] = useState<PaymentReminder[]>([
    {
      id: '1',
      loanId: '3',
      amount: 4500000,
      dueDate: '2024-02-15',
      type: 'full',
      status: 'pending'
    },
    {
      id: '2',
      loanId: '3',
      amount: 4500000,
      dueDate: '2024-03-15',
      type: 'full',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'in-review': return 'Đang xét duyệt';
      case 'pending': return 'Chờ xử lý';
      default: return status;
    }
  };

  const calculateDaysRemaining = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const approvedLoans = loanApplications.filter(loan => loan.status === 'approved');
  const pendingLoans = loanApplications.filter(loan => loan.status === 'pending' || loan.status === 'in-review');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Theo dõi thông minh khoản vay
          </CardTitle>
          <CardDescription>
            Quản lý tất cả đơn vay và thanh toán của bạn tại một nơi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Đơn vay</TabsTrigger>
              <TabsTrigger value="payments">Lịch thanh toán</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{loanApplications.length}</div>
                  <div className="text-sm text-gray-600">Tổng đơn vay</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{approvedLoans.length}</div>
                  <div className="text-sm text-gray-600">Đã được duyệt</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{pendingLoans.length}</div>
                  <div className="text-sm text-gray-600">Đang chờ</div>
                </div>
              </div>

              <div className="space-y-4">
                {loanApplications.map((loan) => {
                  const daysRemaining = calculateDaysRemaining(loan.expectedDecision);
                  return (
                    <div key={loan.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{loan.bankName}</h4>
                          <p className="text-gray-600">{loan.amount.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <Badge className={getStatusColor(loan.status)}>
                          {getStatusText(loan.status)}
                        </Badge>
                      </div>
                      
                      {loan.interestRate && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">Lãi suất:</span> {loan.interestRate}%/năm
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">
                          Ngày nộp: {new Date(loan.submittedDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-sm text-gray-600">
                          Dự kiến quyết định: {new Date(loan.expectedDecision).toLocaleDateString('vi-VN')}
                          {loan.status === 'in-review' && daysRemaining > 0 && (
                            <span className="ml-2 text-blue-600">
                              (còn {daysRemaining} ngày)
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {loan.status === 'in-review' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tiến độ xét duyệt</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 mb-3">{loan.notes}</p>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                        {loan.status === 'pending' && (
                          <Button size="sm">
                            Bổ sung hồ sơ
                          </Button>
                        )}
                        {loan.status === 'approved' && (
                          <Button size="sm">
                            Ký hợp đồng
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="space-y-4">
                {paymentReminders.map((payment) => {
                  const loan = loanApplications.find(l => l.id === payment.loanId);
                  const daysUntilDue = calculateDaysRemaining(payment.dueDate);
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;
                  
                  return (
                    <div key={payment.id} className={`p-4 border rounded-lg ${
                      isOverdue ? 'border-red-200 bg-red-50' :
                      isDueSoon ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200 bg-white'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{loan?.bankName}</h4>
                          <p className="text-gray-600">{payment.amount.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {new Date(payment.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                          {isOverdue && (
                            <div className="text-xs text-red-600 font-medium">
                              Quá hạn {Math.abs(daysUntilDue)} ngày
                            </div>
                          )}
                          {isDueSoon && (
                            <div className="text-xs text-yellow-600 font-medium">
                              Còn {daysUntilDue} ngày
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {payment.type === 'full' ? 'Thanh toán đầy đủ' :
                           payment.type === 'principal' ? 'Trả gốc' : 'Trả lãi'}
                        </Badge>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <Bell className="mr-2 h-4 w-4" />
                            Nhắc nhở
                          </Button>
                          <Button size="sm">
                            Thanh toán
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tổng quan tài chính</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tổng số tiền vay được duyệt:</span>
                        <span className="font-medium">
                          {approvedLoans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lãi suất trung bình:</span>
                        <span className="font-medium">
                          {approvedLoans.length > 0 
                            ? (approvedLoans.reduce((sum, loan) => sum + (loan.interestRate || 0), 0) / approvedLoans.length).toFixed(2)
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thanh toán hàng tháng dự kiến:</span>
                        <span className="font-medium">
                          {paymentReminders.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Khuyến nghị</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <TrendingDown className="inline mr-2 h-4 w-4" />
                          Bạn có thể tiết kiệm 2.3 triệu VND/năm bằng cách tái cấu trúc khoản vay
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm">
                          <Calculator className="inline mr-2 h-4 w-4" />
                          Thanh toán trước hạn 50 triệu VND có thể giảm tổng lãi suất 15%
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">
                          <Bell className="inline mr-2 h-4 w-4" />
                          Đến hạn thanh toán trong 3 ngày - chuẩn bị 4.5 triệu VND
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartLoanTracker;
