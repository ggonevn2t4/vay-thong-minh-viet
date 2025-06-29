
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/pages/UserDashboard';
import AdvisorDashboard from '@/pages/AdvisorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import BankEmployeeDashboard from '@/pages/BankEmployeeDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen';

const RoleBasedDashboard = () => {
  console.log('RoleBasedDashboard component loaded');
  
  const { userRole, user, loading } = useAuth();
  
  console.log('Auth state in RoleBasedDashboard:', { userRole, user: user?.id, loading });

  if (loading) {
    console.log('Auth is still loading, showing loading screen');
    return <AuthLoadingScreen />;
  }

  if (!user) {
    console.log('No user found, showing login prompt');
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

  console.log('Rendering dashboard for role:', userRole);

  switch (userRole) {
    case 'customer':
      console.log('Rendering UserDashboard');
      return <UserDashboard />;
    case 'advisor':
      console.log('Rendering AdvisorDashboard');
      return <AdvisorDashboard />;
    case 'admin':
      console.log('Rendering AdminDashboard');
      return <AdminDashboard />;
    case 'bank_employee':
      console.log('Rendering BankEmployeeDashboard');
      return <BankEmployeeDashboard />;
    default:
      console.log('Unknown or undefined role, showing role assignment prompt');
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
