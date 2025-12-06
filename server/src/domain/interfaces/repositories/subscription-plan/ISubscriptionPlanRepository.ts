import { IBaseRepository } from '../IBaseRepository';
import { SubscriptionPlan } from '../../../entities/subscription-plan.entity';

export interface SubscriptionPlanQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedSubscriptionPlans {
  plans: SubscriptionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlan> {
  findByName(name: string): Promise<SubscriptionPlan | null>;
  findAllWithPagination(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans>;
  unmarkAllAsPopular(): Promise<void>;
  findByIds(ids: string[]): Promise<SubscriptionPlan[]>;
  findDefault(): Promise<SubscriptionPlan | null>;
  unmarkAllAsDefault(): Promise<void>;
  
  findByStripePriceId(stripePriceId: string): Promise<SubscriptionPlan | null>;
  updateStripeIds(id: string, data: {
    stripeProductId?: string;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
  }): Promise<SubscriptionPlan | null>;
}
