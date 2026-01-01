import { GetAllPaymentOrdersResponseDto } from 'src/application/dtos/admin/responses/get-all-payment-orders-response.dto';
import { GetAllPaymentOrdersRequestDto } from 'src/application/dtos/admin/common/payment-order.dto';


export interface IGetAllPaymentOrdersUseCase {
  execute(query: GetAllPaymentOrdersRequestDto): Promise<GetAllPaymentOrdersResponseDto>;
}

