
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import Navigation from './Navigation';
import UserProfile from './UserProfile';
import MobileMenu from './MobileMenu';

/**
 * Main header component
 * Contains logo, navigation, and user profile sections
 * @returns {JSX.Element} The application header
 */
const Header = () => {
  const { navLinks } = useNavigation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo section */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-brand-600 text-white font-bold p-2 rounded-lg">
            <span className="text-xl">VTM</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">VayThôngMinh</span>
        </Link>
        
        {/* Desktop navigation */}
        <Navigation 
          navLinks={navLinks}
          className="hidden md:flex items-center space-x-6"
        />
        
        {/* User profile and mobile menu */}
        <div className="flex items-center space-x-3">
          <UserProfile />
          <MobileMenu navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
};

export default Header;
