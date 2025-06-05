
import { useAuth, useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'advisor' | 'customer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  // If auth is still loading, show enhanced loading state
  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }
  
  // If user is not authenticated, redirect to home page
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  
  // Check role-based access if requiredRole is specified
  if (requiredRole) {
    const userRole = user?.publicMetadata?.role as string || 'customer';
    
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const redirectPath = userRole === 'admin' ? '/admin-dashboard' : 
                          userRole === 'advisor' ? '/advisor-dashboard' : 
                          '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
