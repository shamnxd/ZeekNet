import { PaymentResponseDto } from 'src/application/dtos/payment/responses/payment-response.dto';

export interface IGetPaymentHistoryUseCase {
  execute(userId: string): Promise<PaymentResponseDto[]>;
}
