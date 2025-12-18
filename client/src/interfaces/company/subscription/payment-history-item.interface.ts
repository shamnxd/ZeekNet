export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  invoiceId?: string;
  transactionId?: string;
  stripeInvoiceUrl?: string;
  stripeInvoicePdf?: string;
  billingCycle?: 'monthly' | 'yearly';
  createdAt: string;
}
