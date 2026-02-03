import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';

export interface ICancelSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscriptionResponseDto>;
}
