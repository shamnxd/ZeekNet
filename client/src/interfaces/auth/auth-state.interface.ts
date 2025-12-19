import type { UserRole } from "@/constants/enums";

export interface AuthState {
  token: string | null;
  id: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  isVerified: boolean;
  isBlocked: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  companyVerificationStatus?: 'not_created' | 'pending' | 'verified' | 'rejected' | null;
  companyLogo?: string | null;
  companyName?: string | null;
}
