import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';

// be

export interface IUpdateSubscriptionPlanUseCase {
  execute(planId: string, data: {
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
    isDefault?: boolean;
  }): Promise<SubscriptionPlan>;
}
