import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { BillingCycle } from '../enums/billing-cycle.enum';

export class PaymentOrder {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly planId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: PaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly invoiceId?: string,
    public readonly transactionId?: string,
    public readonly metadata?: Record<string, unknown>,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly stripePaymentIntentId?: string,
    public readonly stripeInvoiceId?: string,
    public readonly stripeInvoiceUrl?: string,
    public readonly stripeInvoicePdf?: string,
    public readonly subscriptionId?: string,
    public readonly billingCycle?: BillingCycle,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    planId: string;
    amount: number;
    currency?: string;
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    invoiceId?: string;
    transactionId?: string;
    metadata?: Record<string, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
    stripePaymentIntentId?: string;
    stripeInvoiceId?: string;
    stripeInvoiceUrl?: string;
    stripeInvoicePdf?: string;
    subscriptionId?: string;
    billingCycle?: BillingCycle;
  }): PaymentOrder {
    const now = new Date();
    return new PaymentOrder(
      data.id,
      data.companyId,
      data.planId,
      data.amount,
      data.currency ?? 'INR',
      data.status ?? PaymentStatus.PENDING,
      data.paymentMethod ?? PaymentMethod.DUMMY,
      data.invoiceId,
      data.transactionId,
      data.metadata,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.stripePaymentIntentId,
      data.stripeInvoiceId,
      data.stripeInvoiceUrl,
      data.stripeInvoicePdf,
      data.subscriptionId,
      data.billingCycle,
    );
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }
}
