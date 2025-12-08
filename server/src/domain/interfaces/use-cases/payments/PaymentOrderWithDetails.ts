
export interface PaymentOrderWithDetails {
  id: string;
  orderNo: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'dummy' | 'stripe' | 'card';
  invoiceId?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
