import { ISubscriptionPlanRepository, SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';

export class GetAllSubscriptionPlansUseCase implements IGetAllSubscriptionPlansUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans> {
    return await this._subscriptionPlanRepository.findAllWithPagination(options);
  }
}

