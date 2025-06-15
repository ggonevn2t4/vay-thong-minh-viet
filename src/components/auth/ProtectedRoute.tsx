
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'advisor' | 'customer' | 'bank_employee';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  
  // If auth is still loading, show enhanced loading state
  if (loading) {
    return <AuthLoadingScreen />;
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check role-based access if requiredRole is specified
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = userRole === 'admin' ? '/admin-dashboard' : 
                        userRole === 'advisor' ? '/advisor-dashboard' : 
                        '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
