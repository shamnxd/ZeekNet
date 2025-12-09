import { SubscriptionPlan } from '../../../entities/subscription-plan.entity';
import { PaginatedSubscriptionPlans, SubscriptionPlanQueryOptions } from '../../repositories/subscription-plan/ISubscriptionPlanRepository';
import { CreateSubscriptionPlanRequestDto, UpdateSubscriptionPlanRequestDto } from 'src/application/dto/admin/subscription-plan-management.dto';

export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanRequestDto): Promise<SubscriptionPlan>;
}

export interface IGetAllSubscriptionPlansUseCase {
  execute(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
}

export interface IGetSubscriptionPlanByIdUseCase {
  execute(planId: string): Promise<SubscriptionPlan>;
}

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

