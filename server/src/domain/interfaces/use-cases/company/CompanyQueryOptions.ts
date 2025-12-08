
export interface CompanyQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: 'pending' | 'rejected' | 'verified';
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
