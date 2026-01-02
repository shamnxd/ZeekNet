import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';


export interface IGetSubscriptionPlanByIdUseCase {
  execute(planId: string): Promise<SubscriptionPlan>;
}
