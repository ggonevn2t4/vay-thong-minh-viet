
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  User,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import SmartLoanTracker from '@/components/SmartLoanTracker';
import UserProfileTab from '@/components/dashboard/UserProfileTab';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

interface UserDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  applications: LoanApplication[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const UserDashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  applications, 
  getStatusColor, 
  getStatusText 
}: UserDashboardTabsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const approvedApplications = applications.filter(app => app.status === 'approved');
  const pendingApplications = applications.filter(app => app.status === 'pending' || app.status === 'reviewing');
  const totalLoanAmount = approvedApplications.reduce((sum, app) => sum + app.amount, 0);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Tổng quan</span>
        </TabsTrigger>
        <TabsTrigger value="loans" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Khoản vay</span>
        </TabsTrigger>
        <TabsTrigger value="tracker" className="flex items-center gap-2">
          <PiggyBank className="h-4 w-4" />
          <span className="hidden sm:inline">Theo dõi vay</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Hồ sơ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng đơn vay</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã phê duyệt</p>
                  <p className="text-2xl font-bold text-green-600">{approvedApplications.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng số tiền</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(totalLoanAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn vay gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.type}</p>
                      <p className="text-sm text-gray-600">Mã: {app.id}</p>
                      <p className="text-sm text-gray-600">Số tiền: {formatCurrency(app.amount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusText(app.status)}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="loans" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn vay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{app.type}</h4>
                      <p className="text-gray-600">Mã đơn: {app.id}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusText(app.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Số tiền vay</p>
                      <p className="font-medium">{formatCurrency(app.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Thời hạn</p>
                      <p className="font-medium">{app.term} tháng</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày nộp</p>
                      <p className="font-medium">{app.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <p className="font-medium">{getStatusText(app.status)}</p>
                    </div>
                  </div>
                  
                  {app.status === 'reviewing' && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Tiến độ xét duyệt</p>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                    {app.status === 'approved' && (
                      <Button size="sm">
                        Ký hợp đồng
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tracker" className="space-y-6">
        <SmartLoanTracker />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <UserProfileTab />
      </TabsContent>
    </Tabs>
  );
};

export default UserDashboardTabs;
