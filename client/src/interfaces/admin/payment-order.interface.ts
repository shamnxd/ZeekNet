export interface PaymentOrder {
  id: string;
  orderNo: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'dummy' | 'stripe' | 'card';
  invoiceId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllPaymentOrdersParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  search?: string;
  sortOrder?: 'asc' | 'desc';
}
