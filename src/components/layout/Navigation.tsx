
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  const navigationItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/advisor-directory', label: 'Tư vấn viên' },
    { href: '/loan-comparison', label: 'So sánh khoản vay' },
    { href: '/loan-optimization', label: 'Tối ưu khoản vay' },
    { href: '/messages', label: 'Tin nhắn', requireAuth: true },
  ];

  // Add role-specific navigation
  const roleSpecificItems = [];
  if (userRole === 'customer') {
    roleSpecificItems.push({ href: '/user-dashboard', label: 'Dashboard' });
  } else if (userRole === 'advisor') {
    roleSpecificItems.push({ href: '/advisor-dashboard', label: 'Dashboard' });
  } else if (userRole === 'admin') {
    roleSpecificItems.push({ href: '/admin-dashboard', label: 'Admin' });
  }

  const allItems = [...navigationItems, ...roleSpecificItems];

  return (
    <nav className="flex space-x-8">
      {allItems.map((item) => {
        if (item.requireAuth && !userRole) return null;
        
        return (
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
        );
      })}
    </nav>
  );
};

export default Navigation;
