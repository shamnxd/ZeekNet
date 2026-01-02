import { CreateSubscriptionPlanRequestDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan-request.dto';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';


export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanRequestDto): Promise<SubscriptionPlan>;
}

