import { CompanySubscription, SubscriptionStatus } from '../../../entities/company-subscription.entity';

export interface CreateSubscriptionData {
  companyId: string;
  planId: string;
  startDate: Date | null;
  expiryDate: Date | null;
  isActive?: boolean;
  jobPostsUsed?: number;
  featuredJobsUsed?: number;
  applicantAccessUsed?: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeStatus?: SubscriptionStatus;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}

export interface ICompanySubscriptionRepository {
  create(data: CreateSubscriptionData): Promise<CompanySubscription>;
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
  
  findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<CompanySubscription | null>;
}
