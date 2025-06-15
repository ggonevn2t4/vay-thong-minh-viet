
import { useLocation } from 'react-router-dom';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  isActive?: boolean;
}

export const useNavigation = () => {
  const location = useLocation();

  const navLinks: NavLink[] = [
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
      href: '/toi-uu-hoa-vay',
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

  // Add isActive property based on current location
  const navigationItems = navLinks.map(link => ({
    ...link,
    isActive: location.pathname === link.href,
  }));

  return {
    navigationItems,
  };
};
