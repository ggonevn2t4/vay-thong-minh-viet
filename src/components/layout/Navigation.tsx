
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  navLinks: Array<{ name: string; path: string }>;
  className?: string;
}

const Navigation = ({ navLinks, className }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className={className}>
      {navLinks.map((link) => (
        <Link 
          key={link.path}
          to={link.path} 
          className={`text-sm font-medium transition-colors ${
            location.pathname === link.path 
              ? 'text-brand-600' 
              : 'text-gray-600 hover:text-brand-600'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
