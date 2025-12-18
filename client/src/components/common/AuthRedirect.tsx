import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { UserRole } from '@/constants/enums';
import { Loading } from '@/components/ui/loading';
import type { AuthRedirectProps } from '@/interfaces/ui/auth-redirect-props.interface';

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated, role, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <Loading />;
  }

  if (isAuthenticated && role) {
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

export default AuthRedirect;