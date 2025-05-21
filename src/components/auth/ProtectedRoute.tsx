
import { useAuth } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    // You can show a loading spinner here if you want
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (!isSignedIn) {
    // Redirect to the home page if not signed in
    // Store the current location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
