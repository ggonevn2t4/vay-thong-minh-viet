
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
  /** Array of navigation links */
  navLinks: Array<{ name: string; href: string; isActive?: boolean }>;
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
const MobileMenu = ({ navLinks }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  // For now, default to customer role - will be updated with role management
  const userRole: UserRole = 'customer';

  /**
   * Get role badge configuration based on user role
   * @returns {Object} Role badge configuration
   */
  const getRoleBadge = () => ROLE_CONFIG[userRole];

  /**
   * Close the mobile menu sheet
   */
  const closeSheet = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] pt-10">
          <div className="flex flex-col gap-6 py-6">
            {user && (
              <div className="pb-4 border-b flex items-center justify-between">
                <Badge className={getRoleBadge().color}>
                  {getRoleBadge().label}
                </Badge>
                <NotificationSystem />
              </div>
            )}
            
            <Navigation 
              navLinks={navLinks}
              className="flex flex-col space-y-6"
            />
            
            <div className="mt-4 space-y-4">
              {!user ? (
                <>
                  <Link to="/khao-sat" onClick={closeSheet}>
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      Bắt đầu khảo sát
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={closeSheet}>
                    <Button variant="outline" className="w-full mt-2">Đăng nhập</Button>
                  </Link>
                </>
              ) : (
                <Link to="/khao-sat" onClick={closeSheet}>
                  <Button className="w-full bg-brand-600 hover:bg-brand-700">
                    Bắt đầu khảo sát
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
