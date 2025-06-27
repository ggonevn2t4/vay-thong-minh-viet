import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  mainNavItems: { href: string; label: string }[];
  isActive: (path: string) => boolean;
  user: any;
}

const MobileMenu = ({
  isOpen,
  toggleMenu,
  mainNavItems,
  isActive,
  user,
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={toggleMenu}>
      <SheetTrigger asChild className="lg:hidden">
        <Menu className="h-6 w-6 text-gray-700" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explore our services and manage your account.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={toggleMenu}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/user-dashboard"
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${
                  isActive("/user-dashboard")
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${
                  isActive("/settings")
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={toggleMenu}
              >
                Settings
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={toggleMenu}
            >
              Login/Register
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface NavigationProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const Navigation = ({ isOpen, toggleMenu }: NavigationProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { href: "/marketplace", label: "Sàn giao dịch" },
    { href: "/advisor-directory", label: "Tư vấn viên" },
    { href: "/loan-comparison", label: "So sánh vay" },
    { href: "/loan-application", label: "Đăng ký vay" },
    { href: "/about", label: "Về chúng tôi" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
              isActive(item.href)
                ? "bg-brand-50 text-brand-700"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        mainNavItems={mainNavItems}
        isActive={isActive}
        user={user}
      />
    </>
  );
};

export default Navigation;
