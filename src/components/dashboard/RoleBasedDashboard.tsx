
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/pages/UserDashboard';
import AdvisorDashboard from '@/pages/AdvisorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import BankEmployeeDashboard from '@/pages/BankEmployeeDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RoleBasedDashboard = () => {
  const { userRole, user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h2>
            <p className="text-gray-600 mb-6">Vui lòng đăng nhập để truy cập dashboard.</p>
            <Link to="/auth">
              <Button className="bg-brand-600 hover:bg-brand-700">
                Đăng nhập
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (userRole) {
    case 'customer':
      return <UserDashboard />;
    case 'advisor':
      return <AdvisorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'bank_employee':
      return <BankEmployeeDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa xác định vai trò</h2>
              <p className="text-gray-600 mb-6">Tài khoản của bạn chưa được gán vai trò. Vui lòng liên hệ quản trị viên.</p>
              <Link to="/">
                <Button variant="outline">
                  Về trang chủ
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default RoleBasedDashboard;
