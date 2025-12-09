import { PaymentOrderWithDetails } from 'src/domain/interfaces/use-cases/payments/PaymentOrderWithDetails';

export interface GetAllPaymentOrdersResponseDto {
  orders: PaymentOrderWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
