import { ISubscriptionPlanRepository, SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class GetAllSubscriptionPlansUseCase implements IGetAllSubscriptionPlansUseCase {
  constructor(@inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans> {
    return await this._subscriptionPlanRepository.findAllWithPagination(options);
  }
}

