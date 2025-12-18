import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { UserRole } from '@/constants/enums';
import { Loading } from '@/components/ui/loading';
import type { ProtectedRouteProps } from '@/interfaces/ui/protected-route-props.interface';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, role, isInitialized, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized || loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    switch (role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.COMPANY:
        return <Navigate to="/company/dashboard" replace />;
      case UserRole.SEEKER:
        return <Navigate to="/seeker/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;