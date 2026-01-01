import { PaymentOrderWithDetailsResponseDto } from 'src/application/dtos/payment/responses/payment-order-with-details-response.dto';

export interface GetAllPaymentOrdersResponseDto {
  orders: PaymentOrderWithDetailsResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
