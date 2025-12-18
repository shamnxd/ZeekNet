import type { ReactNode } from 'react';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}
