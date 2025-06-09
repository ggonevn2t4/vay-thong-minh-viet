
import { useAuth } from '@/contexts/AuthContext';

/**
 * Type definition for user roles
 */
type UserRole = 'admin' | 'advisor' | 'customer';

/**
 * Type definition for navigation links
 */
interface NavLink {
  name: string;
  path: string;
}

/**
 * Custom hook for navigation management
 * Provides role-based navigation links based on user authentication and role
 * @returns {Object} Object containing navigation links array
 */
export const useNavigation = () => {
  const { user } = useAuth();
  // For now, default to customer role - will be updated with role management
  const userRole: UserRole = 'customer';
  
  /**
   * Get navigation links based on user role
   * @returns {NavLink[]} Array of navigation links
   */
  const getNavLinks = (): NavLink[] => {
    const baseLinks: NavLink[] = [
      { name: "Trang chủ", path: "/" },
      { name: "Khảo sát", path: "/khao-sat" },
      { name: "So sánh", path: "/so-sanh" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "So sánh khoản vay", path: "/loan-comparison" },
      { name: "FAQ", path: "/faq" }
    ];

    // Add authenticated user links
    if (user) {
      baseLinks.splice(4, 0, { name: "Tin nhắn", path: "/messages" });
    }

    // Add role-specific dashboard links
    if (user) {
      switch (userRole) {
        case 'admin':
          baseLinks.push({ name: "Quản trị", path: "/admin-dashboard" });
          break;
        case 'advisor':
          baseLinks.push({ name: "Tư vấn viên", path: "/advisor-dashboard" });
          break;
        default:
          baseLinks.push({ name: "Khu vực khách hàng", path: "/dashboard" });
      }
    }

    return baseLinks;
  };

  return { navLinks: getNavLinks() };
};
