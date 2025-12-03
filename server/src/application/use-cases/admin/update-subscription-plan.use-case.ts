import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { IUpdateSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
import { AppError, NotFoundError } from '../../../domain/errors/errors';

export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(
    planId: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      features?: string[];
      jobPostLimit?: number;
      featuredJobLimit?: number;
      applicantAccessLimit?: number;
      yearlyDiscount?: number;
      isActive?: boolean;
      isPopular?: boolean;
    },
  ): Promise<SubscriptionPlan> {
    const existingPlan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!existingPlan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (data.name !== undefined) {
      const normalizedName = data.name.trim();
      if (!normalizedName) {
        throw new AppError('Plan name cannot be empty', 400);
      }

      const planWithSameName = await this._subscriptionPlanRepository.findByName(normalizedName);
      if (planWithSameName && planWithSameName.id !== planId) {
        throw new AppError('Subscription plan with this name already exists', 409);
      }
      data.name = normalizedName;
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new AppError('Plan description cannot be empty', 400);
    }

    if (data.price !== undefined && data.price < 0) {
      throw new AppError('Price must be a positive number', 400);
    }

    if (data.duration !== undefined && data.duration < 1) {
      throw new AppError('Duration must be at least 1 day', 400);
    }

    if (data.yearlyDiscount !== undefined && (data.yearlyDiscount < 0 || data.yearlyDiscount > 100)) {
      throw new AppError('Yearly discount must be between 0 and 100', 400);
    }

    if (data.isPopular === true) {
      await this._subscriptionPlanRepository.unmarkAllAsPopular();
    }

    const updatedPlan = await this._subscriptionPlanRepository.update(planId, data as Partial<SubscriptionPlan>);
    
    if (!updatedPlan) {
      throw new NotFoundError('Subscription plan not found after update');
    }

    return updatedPlan;
  }
}
