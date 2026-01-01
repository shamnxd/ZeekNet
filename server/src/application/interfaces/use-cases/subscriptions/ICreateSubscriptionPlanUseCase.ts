import { CreateSubscriptionPlanRequestDto } from 'src/application/dto/admin/subscription-plan-management.dto';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';


export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanRequestDto): Promise<SubscriptionPlan>;
}
