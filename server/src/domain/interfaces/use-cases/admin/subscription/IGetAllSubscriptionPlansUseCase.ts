import { SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';


export interface IGetAllSubscriptionPlansUseCase {
  execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
}
