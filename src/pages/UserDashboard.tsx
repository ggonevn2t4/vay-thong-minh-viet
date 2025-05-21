
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

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
            className="mt-4 md:mt-0"
          >
            Đăng ký khoản vay mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số khoản vay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khoản vay đã được duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đang chờ duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Khoản vay của bạn</CardTitle>
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
      </div>
    </Layout>
  );
};

export default UserDashboard;
