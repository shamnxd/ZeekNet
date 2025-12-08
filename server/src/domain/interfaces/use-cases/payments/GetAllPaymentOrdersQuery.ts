
export interface GetAllPaymentOrdersQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  search?: string;
  sortOrder?: 'asc' | 'desc';
}
