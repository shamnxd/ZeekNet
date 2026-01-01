import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { IGetSubscriptionPlanByIdUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetSubscriptionPlanByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class GetSubscriptionPlanByIdUseCase implements IGetSubscriptionPlanByIdUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(planId: string): Promise<SubscriptionPlan> {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    return plan;
  }
}

