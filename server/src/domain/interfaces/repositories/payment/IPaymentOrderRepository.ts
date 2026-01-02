import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface IPaymentOrderRepository extends IBaseRepository<PaymentOrder> {
  findByCompanyId(companyId: string): Promise<PaymentOrder[]>;
  findByStripeInvoiceId(stripeInvoiceId: string): Promise<PaymentOrder | null>;
  updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'): Promise<void>;
  findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]>;
}
