
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

interface UserLoansTabProps {
  applications: LoanApplication[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const UserLoansTab = ({ applications, getStatusColor, getStatusText }: UserLoansTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default UserLoansTab;
