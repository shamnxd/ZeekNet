import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { PaginatedSubscriptionPlans, SubscriptionPlanQueryOptions } from '../repositories/subscription-plan/ISubscriptionPlanRepository';

export interface ICreateSubscriptionPlanUseCase {
  execute(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
  }): Promise<SubscriptionPlan>;
}

export interface IGetAllSubscriptionPlansUseCase {
  execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
}

export interface IGetSubscriptionPlanByIdUseCase {
  execute(planId: string): Promise<SubscriptionPlan>;
}

export interface IUpdateSubscriptionPlanUseCase {
  execute(
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
      isActive?: boolean;
    }
  ): Promise<SubscriptionPlan>;
}

