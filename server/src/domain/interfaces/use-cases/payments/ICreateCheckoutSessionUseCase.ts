import { CreateCheckoutSessionResponseDto } from 'src/application/dto/company/checkout-session-response.dto';
import { CreateCheckoutSessionRequestDto } from 'src/application/dto/company/create-checkout-session.dto';


export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto>;
}
