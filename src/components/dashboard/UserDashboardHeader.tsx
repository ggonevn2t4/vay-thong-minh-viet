
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UserDashboardHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default UserDashboardHeader;
