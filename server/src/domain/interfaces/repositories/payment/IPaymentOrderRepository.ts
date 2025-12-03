import { PaymentOrder } from '../../../entities/payment-order.entity';

export interface IPaymentOrderRepository {
  create(order: PaymentOrder): Promise<PaymentOrder>;
  findById(id: string): Promise<PaymentOrder | null>;
  findByCompanyId(companyId: string): Promise<PaymentOrder[]>;
  findByTransactionId(transactionId: string): Promise<PaymentOrder | null>;
  updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled'): Promise<void>;
  findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]>;
}
