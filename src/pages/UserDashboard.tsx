
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import EnhancedAnalyticsDashboard from '@/components/dashboard/EnhancedAnalyticsDashboard';
import { BarChart3, FileText, User, TrendingUp } from 'lucide-react';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: 'LA-2023-001',
      date: '2023-05-15',
      amount: 150000000,
      term: 12,
      status: 'approved',
      type: 'Vay tín chấp'
    },
    {
      id: 'LA-2023-002',
      date: '2023-07-22',
      amount: 300000000,
      term: 24,
      status: 'pending',
      type: 'Vay thế chấp'
    },
    {
      id: 'LA-2023-003',
      date: '2023-09-10',
      amount: 50000000,
      term: 6,
      status: 'rejected',
      type: 'Vay tiêu dùng'
    },
    {
      id: 'LA-2023-004',
      date: '2023-11-05',
      amount: 200000000,
      term: 36,
      status: 'reviewing',
      type: 'Vay mua xe'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'reviewing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển khách hàng</h1>
            <p className="text-gray-600 mt-2">Quản lý và theo dõi các khoản vay của bạn</p>
          </div>
          <Button
            onClick={() => navigate('/khao-sat')}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Đăng ký khoản vay mới
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Khoản vay</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Phân tích</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số khoản vay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{applications.length}</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+2 tháng này</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Khoản vay đã được duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Tổng giá trị: {formatCurrency(applications
                      .filter(app => app.status === 'approved')
                      .reduce((sum, app) => sum + app.amount, 0))} đ
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Đang chờ duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Thời gian xử lý trung bình: 3-5 ngày
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Khoản vay gần nhất</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg mb-3 last:mb-0 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium">{application.type}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(application.amount)} đ</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(application.status)} text-white mb-1`}>
                        {getStatusText(application.status)}
                      </Badge>
                      <p className="text-xs text-gray-500">{application.date}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab('loans')}
                >
                  Xem tất cả khoản vay
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tất cả khoản vay của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã khoản vay</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Loại khoản vay</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Kỳ hạn (tháng)</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.id}</TableCell>
                        <TableCell>{application.date}</TableCell>
                        <TableCell>{application.type}</TableCell>
                        <TableCell>{formatCurrency(application.amount)} đ</TableCell>
                        <TableCell>{application.term}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(application.status)} text-white`}>
                            {getStatusText(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/chi-tiet-vay/${application.id}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EnhancedAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
