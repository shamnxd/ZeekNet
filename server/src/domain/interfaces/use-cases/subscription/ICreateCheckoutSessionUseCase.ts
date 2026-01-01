import { CreateCheckoutSessionResponseDto } from 'src/application/dtos/subscription/responses/checkout-session-response.dto';
import { CreateCheckoutSessionRequestDto } from 'src/application/dtos/subscription/requests/create-checkout-session.dto';


export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto>;
}

