
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, CheckCircle, TrendingUp, MapPin, Phone, Edit, Eye } from 'lucide-react';
import { Customer } from '@/types/dashboard';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@gmail.com',
      role: 'customer',
      creditScore: 750,
      totalLoanRequests: 3,
      approvedLoans: 2,
      assignedAdvisor: 'Nguyễn Thị Lan',
      location: 'Hà Nội',
      phone: '0987654321',
      createdAt: '2023-06-15',
      status: 'active'
    },
    {
      id: 'CUST-002',
      name: 'Trần Thị Bình',
      email: 'binh.tran@gmail.com',
      role: 'customer',
      creditScore: 680,
      totalLoanRequests: 2,
      approvedLoans: 1,
      assignedAdvisor: 'Trần Văn Minh',
      location: 'TP.HCM',
      phone: '0976543210',
      createdAt: '2023-08-20',
      status: 'active'
    },
    {
      id: 'CUST-003',
      name: 'Lê Minh Cường',
      email: 'cuong.le@gmail.com',
      role: 'customer',
      creditScore: 620,
      totalLoanRequests: 4,
      approvedLoans: 1,
      location: 'Đà Nẵng',
      phone: '0965432109',
      createdAt: '2023-09-10',
      status: 'pending'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCreditScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600 bg-gray-50';
    if (score >= 750) return 'text-green-600 bg-green-50';
    if (score >= 650) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCreditScoreLabel = (score?: number) => {
    if (!score) return 'Chưa có';
    if (score >= 750) return 'Xuất sắc';
    if (score >= 650) return 'Tốt';
    return 'Cần cải thiện';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Danh sách khách hàng</CardTitle>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Điểm tín dụng</TableHead>
              <TableHead>Yêu cầu vay</TableHead>
              <TableHead>Đã duyệt</TableHead>
              <TableHead>Tư vấn viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {customer.location}
                        {customer.phone && (
                          <>
                            <Phone className="h-3 w-3 ml-2" />
                            {customer.phone}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`p-2 rounded-lg ${getCreditScoreColor(customer.creditScore)}`}>
                    <div className="font-semibold">
                      {customer.creditScore || 'N/A'}
                    </div>
                    <div className="text-xs">
                      {getCreditScoreLabel(customer.creditScore)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>{customer.totalLoanRequests}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{customer.approvedLoans}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {customer.assignedAdvisor ? (
                    <div className="text-sm">
                      <div className="font-medium">{customer.assignedAdvisor}</div>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Đã phân công
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      Chưa phân công
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={
                    customer.status === 'active' ? 'bg-green-100 text-green-800' :
                    customer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {customer.status === 'active' ? 'Hoạt động' :
                     customer.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerManagement;
