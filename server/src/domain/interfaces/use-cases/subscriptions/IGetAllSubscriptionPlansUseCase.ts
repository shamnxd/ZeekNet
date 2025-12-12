import { SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from '../../repositories/subscription-plan/ISubscriptionPlanRepository';


export interface IGetAllSubscriptionPlansUseCase {
  execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
}
