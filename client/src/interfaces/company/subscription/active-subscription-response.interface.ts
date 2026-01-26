export interface ActiveSubscriptionResponse {
  id: string;
  companyId: string;
  planId: string;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  activeJobCount: number;
  planName?: string;
  jobPostLimit?: number;
  featuredJobLimit?: number;
  plan?: {
    id: string;
    name: string;
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    isDefault?: boolean;
    price?: number;
  };
  stripeStatus?: string;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}
