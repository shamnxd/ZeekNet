import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/subscriptions/common/update-subscription-plan.dto';

export interface IUpdateSubscriptionPlanUseCase {
  execute(data: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan>;
}

