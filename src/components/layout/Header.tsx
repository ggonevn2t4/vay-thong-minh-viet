
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Khảo sát", path: "/khao-sat" },
    { name: "So sánh", path: "/so-sanh" },
    { name: "So sánh khoản vay", path: "/loan-comparison" },
    { name: "FAQ", path: "/faq" },
    { name: "Khu vực khách hàng", path: "/dashboard" },
  ];

  const closeSheet = () => {
    setIsOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-brand-600 text-white font-bold p-2 rounded-lg">
            <span className="text-xl">VTM</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">VayThôngMinh</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-sm font-medium ${location.pathname === link.path ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
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
            <Link to="/khao-sat" className="hidden sm:block">
              <Button className="bg-brand-600 hover:bg-brand-700 mr-2">Bắt đầu khảo sát</Button>
            </Link>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-10 w-10"
                }
              }}
            />
          </SignedIn>
          
          {/* Mobile Menu */}
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
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      className={`text-base font-medium ${location.pathname === link.path ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}
                      onClick={closeSheet}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="mt-4 space-y-4">
                    <SignedOut>
                      <Link to="/khao-sat" onClick={closeSheet}>
                        <Button className="w-full bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
                      </Link>
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full mt-2">Đăng nhập</Button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
