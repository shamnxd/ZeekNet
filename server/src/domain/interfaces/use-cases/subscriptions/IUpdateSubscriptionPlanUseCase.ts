import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { UpdateSubscriptionPlanDto } from 'src/application/dto/subscriptions/update-subscription-plan.dto';

export interface IUpdateSubscriptionPlanUseCase {
  execute(data: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan>;
}
