import { CreateSubscriptionPlanRequestDto } from 'src/application/dtos/admin/common/subscription-plan-management.dto';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';


export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanRequestDto): Promise<SubscriptionPlan>;
}

