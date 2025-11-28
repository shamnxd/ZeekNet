import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { ICreateSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
import { AppError } from '../../../domain/errors/errors';

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
  }): Promise<SubscriptionPlan> {
    if (!data.name || !data.name.trim()) {
      throw new AppError('Plan name is required', 400);
    }

    if (!data.description || !data.description.trim()) {
      throw new AppError('Plan description is required', 400);
    }

    if (data.price < 0) {
      throw new AppError('Price must be a positive number', 400);
    }

    if (data.duration < 1) {
      throw new AppError('Duration must be at least 1 day', 400);
    }

    const normalizedName = data.name.trim();
    const existingPlan = await this._subscriptionPlanRepository.findByName(normalizedName);
    
    if (existingPlan) {
      throw new AppError('Subscription plan with this name already exists', 409);
    }

    return await this._subscriptionPlanRepository.create({
      name: normalizedName,
      description: data.description.trim(),
      price: data.price,
      duration: data.duration,
      features: data.features,
      jobPostLimit: data.jobPostLimit,
      featuredJobLimit: data.featuredJobLimit,
      applicantAccessLimit: data.applicantAccessLimit,
      isActive: true,
    } as Omit<SubscriptionPlan, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
  }
}
