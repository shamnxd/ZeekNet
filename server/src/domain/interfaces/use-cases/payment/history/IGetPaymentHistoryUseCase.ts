import { PaymentOrder } from 'src/domain/entities/payment-order.entity';


export interface IGetPaymentHistoryUseCase {
  execute(userId: string): Promise<PaymentOrder[]>;
}
