
import { useLocation } from 'react-router-dom';

export interface NavLink {
  name: string;
  href: string;
  description?: string;
  isActive?: boolean;
}

export const useNavigation = () => {
  const location = useLocation();

  const navLinks: NavLink[] = [
    {
      name: 'Trang chủ',
      href: '/',
      description: 'Trang chủ VayThôngMinh',
    },
    {
      name: 'Kiểm tra điều kiện',
      href: '/kiem-tra-dieu-kien',
      description: 'Kiểm tra điều kiện vay vốn',
    },
    {
      name: 'So sánh lãi suất',
      href: '/so-sanh',
      description: 'So sánh lãi suất các ngân hàng',
    },
    {
      name: 'Tối ưu hóa vay',
      href: '/toi-uu-hoa-vay',
      description: 'Tối ưu hóa khoản vay hiện tại',
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      description: 'Sàn giao dịch vay vốn',
    },
    {
      name: 'Tư vấn AI',
      href: '/tu-van-ai',
      description: 'Tư vấn thông minh với AI',
    },
    {
      name: 'Hồ sơ tài liệu',
      href: '/ho-so-tai-lieu',
      description: 'Danh sách hồ sơ cần thiết',
    },
  ];

  // Add isActive property based on current location
  const navLinksWithActive = navLinks.map(link => ({
    ...link,
    isActive: location.pathname === link.href,
  }));

  return {
    navLinks: navLinksWithActive,
  };
};
