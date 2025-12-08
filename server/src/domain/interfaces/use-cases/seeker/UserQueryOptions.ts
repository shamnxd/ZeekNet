
export interface UserQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
