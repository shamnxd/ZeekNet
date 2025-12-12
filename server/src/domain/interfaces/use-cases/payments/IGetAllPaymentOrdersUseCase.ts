import { GetAllPaymentOrdersResponseDto } from 'src/application/dto/admin/get-all-payment-orders-response.dto';
import { GetAllPaymentOrdersRequestDto } from 'src/application/dto/admin/payment-order.dto';


export interface IGetAllPaymentOrdersUseCase {
  execute(query: GetAllPaymentOrdersRequestDto): Promise<GetAllPaymentOrdersResponseDto>;
}
