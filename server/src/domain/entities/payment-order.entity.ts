export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'dummy' | 'stripe' | 'card';

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
  }): PaymentOrder {
    const now = new Date();
    return new PaymentOrder(
      data.id,
      data.companyId,
      data.planId,
      data.amount,
      data.currency ?? 'USD',
      data.status ?? 'pending',
      data.paymentMethod ?? 'dummy',
      data.invoiceId,
      data.transactionId,
      data.metadata,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }
}
