
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const Header = () => {
  const location = useLocation();
  
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
          <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
            Trang chủ
          </Link>
          <Link to="/khao-sat" className={`text-sm font-medium ${location.pathname === '/khao-sat' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
            Khảo sát
          </Link>
          <Link to="/so-sanh" className={`text-sm font-medium ${location.pathname === '/so-sanh' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
            So sánh khoản vay
          </Link>
          <Link to="/gioi-thieu" className={`text-sm font-medium ${location.pathname === '/gioi-thieu' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
            Về chúng tôi
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <SignedOut>
            <Link to="/khao-sat">
              <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát</Button>
            </Link>
            <SignInButton mode="modal">
              <Button variant="outline" className="hidden sm:inline-flex">Đăng nhập</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/khao-sat">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
