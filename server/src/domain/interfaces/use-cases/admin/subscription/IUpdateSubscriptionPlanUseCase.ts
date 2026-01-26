import { SubscriptionPlanResponseDto } from 'src/application/dtos/admin/subscription/responses/subscription-plan-response.dto';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/update-subscription-plan.dto';

export interface IUpdateSubscriptionPlanUseCase {
  execute(data: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanResponseDto>;
}

