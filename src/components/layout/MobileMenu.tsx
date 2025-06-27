
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationSystem from '@/components/NotificationSystem';
import Navigation from './Navigation';

interface MobileMenuProps {
  onClose: () => void;
}

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
 * Mobile menu component
 * Provides mobile-responsive navigation drawer
 * @param {MobileMenuProps} props - The component props
 * @returns {JSX.Element} The mobile menu component
 */
const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { user, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to customer role if userRole is not defined
  const currentRole: UserRole = (userRole as UserRole) || 'customer';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Get role badge configuration based on user role
   * @returns {Object} Role badge configuration
   */
  const getRoleBadge = () => ROLE_CONFIG[currentRole];

  return (
    <div className="lg:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {user && (
            <div className="pb-4 border-b flex items-center justify-between">
              <Badge className={getRoleBadge().color}>
                {getRoleBadge().label}
              </Badge>
              <NotificationSystem />
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <Navigation isOpen={isOpen} toggleMenu={toggleMenu} />
          </div>
          
          <div className="mt-4 space-y-4">
            {!user ? (
              <>
                <Link to="/khao-sat" onClick={onClose}>
                  <Button className="w-full bg-brand-600 hover:bg-brand-700">
                    Bắt đầu khảo sát
                  </Button>
                </Link>
                <Link to="/auth" onClick={onClose}>
                  <Button variant="outline" className="w-full mt-2">Đăng nhập</Button>
                </Link>
              </>
            ) : (
              <Link to="/khao-sat" onClick={onClose}>
                <Button className="w-full bg-brand-600 hover:bg-brand-700">
                  Bắt đầu khảo sát
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
