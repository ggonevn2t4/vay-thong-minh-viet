import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/useNavigation';
import { useState } from 'react';
import NotificationSystem from '@/components/NotificationSystem';

const Header = () => {
  const { user, isLoaded } = useAuth();
  const { navigationItems } = useNavigation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              LoanConnect
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
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
              <Building2 className="mr-2 h-4 w-4" />
              <span className="font-bold">LoanConnect</span>
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
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            {isLoaded && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <NotificationSystem />
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm">
                        Đăng nhập
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">
                        Đăng ký
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
