import { CreateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan.dto';
import { SubscriptionPlanResponseDto } from 'src/application/dtos/admin/subscription/responses/subscription-plan-response.dto';

export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanDto): Promise<SubscriptionPlanResponseDto>;
}

