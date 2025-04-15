import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to home page with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}