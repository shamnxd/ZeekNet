import { CompanySubscription } from '../../../entities/company-subscription.entity';

export interface ICompanySubscriptionRepository {
  create(data: {
    companyId: string;
    planId: string;
    startDate: Date;
    expiryDate: Date;
    isActive?: boolean;
    jobPostsUsed?: number;
    featuredJobsUsed?: number;
    applicantAccessUsed?: number;
  }): Promise<CompanySubscription>;
  findById(id: string): Promise<CompanySubscription | null>;
  findActiveByCompanyId(companyId: string): Promise<CompanySubscription | null>;
  findByCompanyId(companyId: string): Promise<CompanySubscription[]>;
  update(id: string, data: Partial<CompanySubscription>): Promise<CompanySubscription | null>;
  deactivate(id: string): Promise<void>;
  findExpiredSubscriptions(): Promise<CompanySubscription[]>;
  incrementJobPostsUsed(subscriptionId: string): Promise<void>;
  incrementFeaturedJobsUsed(subscriptionId: string): Promise<void>;
  decrementJobPostsUsed(subscriptionId: string): Promise<void>;
  decrementFeaturedJobsUsed(subscriptionId: string): Promise<void>;
}
