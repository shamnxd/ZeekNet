import { GetAllPaymentOrdersResponseDto } from 'src/application/dto/admin/payment-order-response.dto';
import { GetAllPaymentOrdersRequestDto } from 'src/application/dto/admin/payment-order.dto';


export interface IGetAllPaymentOrdersUseCase {
  execute(query: GetAllPaymentOrdersRequestDto): Promise<GetAllPaymentOrdersResponseDto>;
}
