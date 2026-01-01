import { CreateCheckoutSessionResponseDto } from 'src/application/dtos/company/responses/checkout-session-response.dto';
import { CreateCheckoutSessionRequestDto } from 'src/application/dtos/company/requests/create-checkout-session.dto';


export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto>;
}

