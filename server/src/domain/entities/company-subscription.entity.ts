export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid';

export class CompanySubscription {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly planId: string,
    public readonly startDate: Date,
    public readonly expiryDate: Date,
    public readonly isActive: boolean,
    public readonly jobPostsUsed: number,
    public readonly featuredJobsUsed: number,
    public readonly applicantAccessUsed: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly planName?: string,
    public readonly jobPostLimit?: number,
    public readonly featuredJobLimit?: number,
    public readonly stripeCustomerId?: string,
    public readonly stripeSubscriptionId?: string,
    public readonly stripeStatus?: SubscriptionStatus,
    public readonly billingCycle?: 'monthly' | 'yearly',
    public readonly cancelAtPeriodEnd?: boolean,
    public readonly currentPeriodStart?: Date,
    public readonly currentPeriodEnd?: Date,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    planId: string;
    startDate: Date;
    expiryDate: Date;
    isActive?: boolean;
    jobPostsUsed?: number;
    featuredJobsUsed?: number;
    applicantAccessUsed?: number;
    createdAt?: Date;
    updatedAt?: Date;
    planName?: string;
    jobPostLimit?: number;
    featuredJobLimit?: number;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripeStatus?: SubscriptionStatus;
    billingCycle?: 'monthly' | 'yearly';
    cancelAtPeriodEnd?: boolean;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }): CompanySubscription {
    const now = new Date();
    return new CompanySubscription(
      data.id,
      data.companyId,
      data.planId,
      data.startDate,
      data.expiryDate,
      data.isActive ?? true,
      data.jobPostsUsed ?? 0,
      data.featuredJobsUsed ?? 0,
      data.applicantAccessUsed ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.planName,
      data.jobPostLimit,
      data.featuredJobLimit,
      data.stripeCustomerId,
      data.stripeSubscriptionId,
      data.stripeStatus,
      data.billingCycle,
      data.cancelAtPeriodEnd,
      data.currentPeriodStart,
      data.currentPeriodEnd,
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiryDate;
  }

  canPostJob(currentJobCount?: number): boolean {
    if (!this.isActive || this.isExpired()) return false;
    if (this.jobPostLimit === undefined || this.jobPostLimit === -1) return true;
    const used = currentJobCount ?? this.jobPostsUsed;
    return used < this.jobPostLimit;
  }

  canPostFeaturedJob(): boolean {
    if (!this.isActive || this.isExpired()) return false;
    if (this.featuredJobLimit === undefined || this.featuredJobLimit === -1) return true;
    return this.featuredJobsUsed < this.featuredJobLimit;
  }

  isStripeManaged(): boolean {
    return !!this.stripeSubscriptionId;
  }

  isPastDue(): boolean {
    return this.stripeStatus === 'past_due';
  }

  isCanceled(): boolean {
    return this.stripeStatus === 'canceled' || this.cancelAtPeriodEnd === true;
  }
}
