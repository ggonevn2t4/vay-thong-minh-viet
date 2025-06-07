
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationSystem from '@/components/NotificationSystem';

/**
 * Type definition for user roles
 */
type UserRole = 'admin' | 'advisor' | 'customer';

/**
 * Configuration for role badges
 */
const ROLE_CONFIG = {
  admin: { label: "Quản trị viên", color: "bg-red-100 text-red-800" },
  advisor: { label: "Tư vấn viên", color: "bg-blue-100 text-blue-800" },
  customer: { label: "Khách hàng", color: "bg-green-100 text-green-800" }
};

/**
 * User profile component
 * Displays user authentication status, role badge, and action buttons
 * @returns {JSX.Element} The user profile section
 */
const UserProfile = () => {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as UserRole) || 'customer';

  /**
   * Get role badge configuration based on user role
   * @returns {Object} Role badge configuration
   */
  const getRoleBadge = () => ROLE_CONFIG[userRole];

  return (
    <div className="flex items-center space-x-3">
      <SignedOut>
        <Link to="/khao-sat" className="hidden sm:block">
          <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
        </Link>
        <SignInButton mode="modal">
          <Button variant="outline" className="hidden sm:inline-flex">Đăng nhập</Button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <div className="hidden sm:flex items-center space-x-3">
          <Badge className={getRoleBadge().color}>
            {getRoleBadge().label}
          </Badge>
          <Link to="/khao-sat">
            <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
          </Link>
        </div>
        <NotificationSystem />
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-10 w-10"
            }
          }}
        />
      </SignedIn>
    </div>
  );
};

export default UserProfile;
