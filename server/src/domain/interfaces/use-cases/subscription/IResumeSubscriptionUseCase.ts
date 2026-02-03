import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';

export interface IResumeSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscriptionResponseDto>;
}
