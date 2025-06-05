
import { useUser } from '@clerk/clerk-react';

export const useNavigation = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as 'admin' | 'advisor' | 'customer' || 'customer';
  
  const getNavLinks = () => {
    const baseLinks = [
      { name: "Trang chủ", path: "/" },
      { name: "Khảo sát", path: "/khao-sat" },
      { name: "So sánh", path: "/so-sanh" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Tin nhắn", path: "/messages" },
      { name: "So sánh khoản vay", path: "/loan-comparison" },
      { name: "FAQ", path: "/faq" }
    ];

    // Add role-specific dashboard links
    if (userRole === 'admin') {
      baseLinks.push({ name: "Quản trị", path: "/admin-dashboard" });
    } else if (userRole === 'advisor') {
      baseLinks.push({ name: "Tư vấn viên", path: "/advisor-dashboard" });
    } else {
      baseLinks.push({ name: "Khu vực khách hàng", path: "/dashboard" });
    }

    return baseLinks;
  };

  return { navLinks: getNavLinks() };
};
