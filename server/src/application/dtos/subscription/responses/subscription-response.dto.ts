export interface CompanySubscriptionResponseDto {
  id: string;
  companyId: string;
  planId: string;
  plan: {
    id: string;
    name: string;
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    isDefault?: boolean;
  };
  startDate: Date | null;
  expiryDate: Date | null;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  activeJobCount: number;
  createdAt: Date;
  updatedAt: Date;
  stripeStatus?: string;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}
