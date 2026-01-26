import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';

export interface IRevertToDefaultPlanUseCase {
  execute(companyId: string): Promise<CompanySubscriptionResponseDto>;
}
