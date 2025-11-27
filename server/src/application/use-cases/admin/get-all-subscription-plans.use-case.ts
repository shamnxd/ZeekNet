import { ISubscriptionPlanRepository, SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IGetAllSubscriptionPlansUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';

export class GetAllSubscriptionPlansUseCase implements IGetAllSubscriptionPlansUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans> {
    return await this._subscriptionPlanRepository.findAllWithPagination(options);
  }
}
