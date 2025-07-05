
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Settings, MessageSquare, Wallet } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigation } from '@/hooks/useNavigation';
import { useState } from 'react';
import NotificationSystem from '@/components/NotificationSystem';
import { HoveredLink, Menu as NavMenu, MenuItem } from '@/components/ui/navbar-menu';

const Header = () => {
  const { user, userRole, isLoaded, signOut } = useAuth();
  const { navigationItems } = useNavigation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    const names = user.user_metadata.full_name.split(' ');
    return names.map((name: string) => name[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left section: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a61032d1-360d-48f7-9e51-50e6d61d87b1.png" 
              alt="Finzy Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        {/* Center section: Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <NavMenu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Dịch vụ">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink to="/khao-sat">Khảo sát vay vốn</HoveredLink>
                <HoveredLink to="/kiem-tra-dieu-kien">Kiểm tra điều kiện</HoveredLink>
                <HoveredLink to="/so-sanh">So sánh lãi suất</HoveredLink>
                <HoveredLink to="/loan-optimization">Tối ưu hóa vay</HoveredLink>
              </div>
            </MenuItem>
            
            <MenuItem setActive={setActive} active={active} item="Sản phẩm">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink to="/marketplace">Marketplace</HoveredLink>
                <HoveredLink to="/tu-van-ai">Tư vấn AI</HoveredLink>
                <HoveredLink to="/ho-so-tai-lieu">Hồ sơ tài liệu</HoveredLink>
                <HoveredLink to="/financial-guides">Kiến thức tài chính</HoveredLink>
              </div>
            </MenuItem>
            
            {user && (
              <MenuItem setActive={setActive} active={active} item="Tài khoản">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink to="/dashboard">Dashboard</HoveredLink>
                  {userRole === 'customer' && (
                    <>
                      <HoveredLink to="/messages">Tin nhắn</HoveredLink>
                      <HoveredLink to="/wallet">Ví của tôi</HoveredLink>
                    </>
                  )}
                  <HoveredLink to="/settings">Cài đặt</HoveredLink>
                </div>
              </MenuItem>
            )}
          </NavMenu>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
                <img 
                  src="/lovable-uploads/a61032d1-360d-48f7-9e51-50e6d61d87b1.png" 
                  alt="Finzy Logo" 
                  className="h-6 w-auto"
                />
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground/70"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Right section: User actions and authentication */}
        <div className="flex items-center space-x-3">
          {isLoaded && (
            <>
              {user ? (
                <div className="flex items-center space-x-2">
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
                        <Link to="/dashboard" className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Khu vực cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      {userRole === 'customer' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/messages" className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4" />
                              <span>Tin nhắn</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/wallet" className="flex items-center space-x-2">
                              <Wallet className="h-4 w-4" />
                              <span>Ví của tôi</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
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
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
