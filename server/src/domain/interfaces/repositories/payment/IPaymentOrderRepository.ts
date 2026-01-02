import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface IPaymentOrderRepository extends IBaseRepository<PaymentOrder> {
  findByCompanyId(companyId: string): Promise<PaymentOrder[]>;
  findByStripeInvoiceId(stripeInvoiceId: string): Promise<PaymentOrder | null>;
  updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'): Promise<void>;
  findAll(options?: { status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'; sortOrder?: 'asc' | 'desc' }): Promise<PaymentOrder[]>;
  sumTotalEarnings(year?: number): Promise<number>;
  getMonthlyEarnings(year: number): Promise<{ month: number; amount: number }[]>;
  getEarningsByPeriod(period: 'day' | 'week' | 'month' | 'year', startDate?: Date, endDate?: Date): Promise<{ label: string; value: number }[]>;
  findRecent(limit: number): Promise<PaymentOrder[]>;
}
