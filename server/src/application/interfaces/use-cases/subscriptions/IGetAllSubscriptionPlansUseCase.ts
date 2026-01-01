import { SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from '../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';


export interface IGetAllSubscriptionPlansUseCase {
  execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
}
