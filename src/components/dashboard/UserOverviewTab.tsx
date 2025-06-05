
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

interface UserOverviewTabProps {
  applications: LoanApplication[];
  onViewAllLoans: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const UserOverviewTab = ({ applications, onViewAllLoans, getStatusColor, getStatusText }: UserOverviewTabProps) => {
  return (
    <div className="space-y-6">
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
            onClick={onViewAllLoans}
          >
            Xem tất cả khoản vay
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOverviewTab;
