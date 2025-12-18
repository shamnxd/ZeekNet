import type { ReactNode } from 'react';
import type { UserRole } from '@/constants/enums';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}
