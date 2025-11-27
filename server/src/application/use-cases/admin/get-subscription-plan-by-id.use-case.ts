import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { IGetSubscriptionPlanByIdUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
import { NotFoundError } from '../../../domain/errors/errors';

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
