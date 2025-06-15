
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, userRole, loading, signOut } = useAuth();
  const currentRole: UserRole = (userRole as UserRole) || 'customer';

  /**
   * Get role badge configuration based on user role
   * @returns {Object} Role badge configuration
   */
  const getRoleBadge = () => ROLE_CONFIG[currentRole];

  /**
   * Get user's initials for avatar fallback
   * @returns {string} User initials
   */
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    const names = user.user_metadata.full_name.split(' ');
    return names.map((name: string) => name[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link to="/khao-sat" className="hidden sm:block">
          <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
        </Link>
        <Link to="/auth">
          <Button variant="outline" className="hidden sm:inline-flex">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden sm:flex items-center space-x-3">
        <Badge className={getRoleBadge().color}>
          {getRoleBadge().label}
        </Badge>
        <Link to="/khao-sat">
          <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
        </Link>
      </div>
      
      <NotificationSystem />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-brand-100 text-brand-700">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium">
              {user.user_metadata?.full_name || user.email}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center space-x-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-brand-100 text-brand-700">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {user.user_metadata?.full_name || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/user-dashboard" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Khu vực cá nhân</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2 text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
