
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

  // Simplified navigation structure based on your requirements
  const navLinks: NavLink[] = [
    {
      label: 'Trang chủ',
      href: '/',
      description: 'Trang chủ VayThôngMinh',
    },
    {
      label: 'Khởi tạo khoản vay',
      href: '/loan-application',
      description: 'Đăng ký các loại khoản vay',
    },
    {
      label: 'Marketplace',
      href: '/marketplace',
      description: 'Sàn giao dịch vay vốn',
    },
  ];

  // Add isActive property based on current location
  const navigationItems = navLinks.map(link => ({
    ...link,
    isActive: location.pathname === link.href,
  }));

  return {
    navigationItems,
  };
};
