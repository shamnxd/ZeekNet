import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IDeleteSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
import { NotFoundError } from '../../../domain/errors/errors';

export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(planId: string): Promise<boolean> {
    const existingPlan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!existingPlan) {
      throw new NotFoundError('Subscription plan not found');
    }

    return await this._subscriptionPlanRepository.delete(planId);
  }
}
