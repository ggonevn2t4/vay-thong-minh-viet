
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
import { Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  mainNavItems: { href: string; label: string; children?: { href: string; label: string }[] }[];
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
            Khám phá các dịch vụ và quản lý tài khoản của bạn.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {mainNavItems.map((item) => (
            <div key={item.href}>
              <Link
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
              {item.children && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={`block px-3 py-1 text-xs rounded-md transition-colors hover:bg-gray-100 ${
                        isActive(child.href)
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      onClick={toggleMenu}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${
                  isActive("/dashboard")
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
                Cài đặt
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={toggleMenu}
            >
              Đăng nhập/Đăng ký
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
    { href: "/", label: "Trang chủ" },
    {
      href: "/loan-application",
      label: "Khởi tạo khoản vay",
      children: [
        { href: "/loan-application?type=credit-card", label: "Thẻ tín dụng" },
        { href: "/loan-application?type=consumer-unsecured", label: "Vay tiêu dùng tín chấp" },
        { href: "/loan-application?type=consumer-secured", label: "Vay tiêu dùng thế chấp" },
        { href: "/loan-application?type=car-loan", label: "Vay mua xe" },
        { href: "/loan-application?type=real-estate", label: "Vay mua bất động sản" },
        { href: "/loan-application?type=home-improvement", label: "Vay xây sửa nhà ở" },
        { href: "/loan-application?type=business", label: "Vay kinh doanh" },
      ]
    },
    { href: "/marketplace", label: "Marketplace" },
    {
      href: "/support-tools",
      label: "Công cụ hỗ trợ",
      children: [
        { href: "/loan-eligibility", label: "Kiểm tra khả năng vay" },
        { href: "/document-checklist", label: "Hồ sơ tài liệu" },
        { href: "/ai-advisory", label: "Tư vấn AI" },
      ]
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {mainNavItems.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
                      isActive(item.href) || item.children.some(child => isActive(child.href))
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.label === "Khởi tạo khoán vay" ? (
                    <>
                      <div className="px-2 py-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Tín chấp
                        </p>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=credit-card" className="w-full">
                            Thẻ tín dụng
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=consumer-unsecured" className="w-full">
                            Vay tiêu dùng
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Thế chấp
                        </p>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=consumer-secured" className="w-full">
                            Vay tiêu dùng
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=car-loan" className="w-full">
                            Vay mua xe
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=real-estate" className="w-full">
                            Vay mua bất động sản
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=home-improvement" className="w-full">
                            Vay xây sửa nhà ở
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/loan-application?type=business" className="w-full">
                            Vay kinh doanh
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </>
                  ) : (
                    item.children.map((child) => (
                      <DropdownMenuItem asChild key={child.href}>
                        <Link to={child.href} className="w-full">
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
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
