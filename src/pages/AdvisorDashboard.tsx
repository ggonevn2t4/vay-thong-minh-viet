
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, FileText, CheckCircle, Clock, Star, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AdvisorStats {
  totalClients: number;
  activeRequests: number;
  completedLoans: number;
  rating: number;
  monthlyCommission: number;
}

interface ClientRequest {
  id: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
}

const AdvisorDashboard = () => {
  const [stats] = useState<AdvisorStats>({
    totalClients: 45,
    activeRequests: 12,
    completedLoans: 78,
    rating: 4.8,
    monthlyCommission: 15000000
  });

  const [requests] = useState<ClientRequest[]>([
    {
      id: 'REQ-001',
      clientName: 'Nguyễn Văn An',
      amount: 200000000,
      status: 'pending',
      submittedAt: '2024-01-15',
      priority: 'high'
    },
    {
      id: 'REQ-002',
      clientName: 'Trần Thị Bình',
      amount: 150000000,
      status: 'reviewing',
      submittedAt: '2024-01-14',
      priority: 'medium'
    },
    {
      id: 'REQ-003',
      clientName: 'Lê Minh Cường',
      amount: 300000000,
      status: 'approved',
      submittedAt: '2024-01-13',
      priority: 'high'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển tư vấn viên</h1>
            <p className="text-gray-600 mt-2">Quản lý khách hàng và yêu cầu vay</p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">{stats.rating}/5.0</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng khách hàng
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Yêu cầu đang xử lý
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.activeRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Khoản vay hoàn thành
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.completedLoans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Hoa hồng tháng này
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.monthlyCommission)} đ
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu từ khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã yêu cầu</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{request.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {request.clientName}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(request.amount)} đ</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority === 'high' ? 'Cao' : 
                         request.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'pending' ? 'Chờ xử lý' :
                         request.status === 'reviewing' ? 'Đang xem xét' :
                         request.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.submittedAt}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
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

export default AdvisorDashboard;
