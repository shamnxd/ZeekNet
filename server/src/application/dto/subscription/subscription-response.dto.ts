export interface CompanySubscriptionResponseDto {
  id: string;
  companyId: string;
  plan: {
    id: string;
    name: string;
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
  };
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  createdAt: Date;
  updatedAt: Date;
  // Stripe-specific fields
  stripeStatus?: string;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}
