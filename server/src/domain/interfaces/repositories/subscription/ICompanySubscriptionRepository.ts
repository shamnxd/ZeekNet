import { CompanySubscription } from '../../../entities/company-subscription.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanySubscriptionRepository extends IBaseRepository<CompanySubscription> {
  findActiveByCompanyId(companyId: string): Promise<CompanySubscription | null>;
  findByCompanyId(companyId: string): Promise<CompanySubscription[]>;
  deactivate(id: string): Promise<void>;
  findExpiredSubscriptions(): Promise<CompanySubscription[]>;
  incrementJobPostsUsed(subscriptionId: string): Promise<void>;
  incrementFeaturedJobsUsed(subscriptionId: string): Promise<void>;
  decrementJobPostsUsed(subscriptionId: string): Promise<void>;
  decrementFeaturedJobsUsed(subscriptionId: string): Promise<void>;
  findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<CompanySubscription | null>;
}
