import { PaymentOrder } from '../../../entities/payment-order.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface IPaymentOrderRepository extends IBaseRepository<PaymentOrder> {
  findByCompanyId(companyId: string): Promise<PaymentOrder[]>;
  findByStripeInvoiceId(stripeInvoiceId: string): Promise<PaymentOrder | null>;
  updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'): Promise<void>;
  findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]>;
}
