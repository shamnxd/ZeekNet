import { GetAllPaymentOrdersResponseDto } from 'src/application/dtos/admin/payments/responses/get-all-payment-orders-response.dto';
import { GetAllPaymentOrdersRequestDto } from 'src/application/dtos/admin/payments/requests/payment-order.dto';


export interface IGetAllPaymentOrdersUseCase {
  execute(query: GetAllPaymentOrdersRequestDto): Promise<GetAllPaymentOrdersResponseDto>;
}

