
import { useUser } from '@clerk/clerk-react';

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
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || 'customer';
  
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
      { name: "Tin nhắn", path: "/messages" },
      { name: "So sánh khoản vay", path: "/loan-comparison" },
      { name: "FAQ", path: "/faq" }
    ];

    // Add role-specific dashboard links
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

    return baseLinks;
  };

  return { navLinks: getNavLinks() };
};
