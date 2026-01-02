import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';

export interface PaymentResponseDto {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
  transactionId?: string;
  stripeInvoiceUrl?: string;
  stripeInvoicePdf?: string;
  billingCycle?: BillingCycle;
  createdAt?: Date;
}

