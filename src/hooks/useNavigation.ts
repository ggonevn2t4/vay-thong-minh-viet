
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  isActive?: boolean;
}

export const useNavigation = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  let navLinks: NavLink[] = [];

  if (userRole === 'customer') {
    navLinks = [
      {
        label: 'Trang chủ',
        href: '/',
        description: 'Trang chủ VayThôngMinh',
      },
      {
        label: 'Kiến thức tài chính',
        href: '/financial-guides',
        description: 'Hướng dẫn và kiến thức về tài chính',
      },
      {
        label: 'Marketplace',
        href: '/marketplace',
        description: 'Sàn giao dịch vay vốn',
      },
      {
        label: 'Đăng ký vay',
        href: '/khao-sat',
        description: 'Khảo sát nhu cầu vay vốn mới',
      },
      {
        label: 'Tối ưu khoản vay',
        href: '/loan-optimization',
        description: 'Tối ưu hóa khoản vay hiện tại',
      },
    ];
  } else {
    // Default navigation for guests and other roles
    navLinks = [
      {
        label: 'Trang chủ',
        href: '/',
        description: 'Trang chủ VayThôngMinh',
      },
      {
        label: 'Kiểm tra điều kiện',
        href: '/kiem-tra-dieu-kien',
        description: 'Kiểm tra điều kiện vay vốn',
      },
      {
        label: 'So sánh lãi suất',
        href: '/so-sanh',
        description: 'So sánh lãi suất các ngân hàng',
      },
      {
        label: 'Tối ưu hóa vay',
        href: '/loan-optimization',
        description: 'Tối ưu hóa khoản vay hiện tại',
      },
      {
        label: 'Marketplace',
        href: '/marketplace',
        description: 'Sàn giao dịch vay vốn',
      },
      {
        label: 'Tư vấn AI',
        href: '/tu-van-ai',
        description: 'Tư vấn thông minh với AI',
      },
      {
        label: 'Hồ sơ tài liệu',
        href: '/ho-so-tai-lieu',
        description: 'Danh sách hồ sơ cần thiết',
      },
    ];
  }

  // Add isActive property based on current location
  const navigationItems = navLinks.map(link => ({
    ...link,
    isActive: location.pathname === link.href,
  }));

  return {
    navigationItems,
  };
};
