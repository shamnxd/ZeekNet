import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscriptionResponseDto | null>;
}

