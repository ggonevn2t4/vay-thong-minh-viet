
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  /** Array of navigation links with name and path */
  navLinks: Array<{ name: string; path: string }>;
  /** Optional CSS classes for styling */
  className?: string;
}

/**
 * Navigation component that renders a list of navigation links
 * Highlights the current active page based on the URL pathname
 * @param {NavigationProps} props - The component props
 * @returns {JSX.Element} The navigation component
 */
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
