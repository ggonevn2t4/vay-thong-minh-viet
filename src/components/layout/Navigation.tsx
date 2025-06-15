
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps = {}) => {
  const location = useLocation();
  const { userRole } = useAuth();

  // Base navigation items for all users
  const baseNavigationItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/advisor-directory', label: 'Tư vấn viên' },
    { href: '/loan-comparison', label: 'So sánh khoản vay' },
    { href: '/loan-optimization', label: 'Tối ưu khoản vay' },
  ];

  // Role-specific navigation items
  const getRoleSpecificItems = () => {
    const items = [];
    
    if (userRole) {
      items.push({ href: '/messages', label: 'Tin nhắn' });
    }

    switch (userRole) {
      case 'customer':
        items.push(
          { href: '/user-dashboard', label: 'Dashboard' },
          { href: '/ai-advisory', label: 'Tư vấn AI' },
          { href: '/document-checklist', label: 'Hồ sơ tài liệu' }
        );
        break;
      case 'advisor':
        items.push(
          { href: '/advisor-dashboard', label: 'Dashboard' },
          { href: '/advisor-profile', label: 'Hồ sơ cá nhân' },
          { href: '/knowledge-management', label: 'Quản lý kiến thức' }
        );
        break;
      case 'admin':
        items.push(
          { href: '/admin-dashboard', label: 'Admin Dashboard' },
          { href: '/user-management', label: 'Quản lý người dùng' },
          { href: '/system-analytics', label: 'Phân tích hệ thống' }
        );
        break;
    }

    return items;
  };

  const allItems = [...baseNavigationItems, ...getRoleSpecificItems()];

  return (
    <nav className={cn('flex space-x-8', className)}>
      {allItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-gray-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors',
            location.pathname === item.href && 'text-brand-600 border-b-2 border-brand-600'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
