import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { IGetSubscriptionPlanByIdUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetSubscriptionPlanByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetSubscriptionPlanByIdUseCase implements IGetSubscriptionPlanByIdUseCase {
  constructor(@inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(planId: string): Promise<SubscriptionPlan> {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!plan) {
      throw new NotFoundError(ERROR.NOT_FOUND('Subscription plan'));
    }

    return plan;
  }
}

