import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { SubscriptionStatus } from '../../../domain/enums/subscription-status.enum';
import { BillingCycle } from '../../../domain/enums/billing-cycle.enum';
import { CreateInput } from '../../../domain/types/common.types';

export class CompanySubscriptionMapper {
  static toEntity(data: {
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
    billingCycle?: BillingCycle;
    cancelAtPeriodEnd?: boolean;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }): CreateInput<CompanySubscription> {
    return {
      companyId: data.companyId,
      planId: data.planId,
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      isActive: data.isActive ?? true,
      jobPostsUsed: data.jobPostsUsed ?? 0,
      featuredJobsUsed: data.featuredJobsUsed ?? 0,
      applicantAccessUsed: data.applicantAccessUsed ?? 0,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripeStatus: data.stripeStatus,
      billingCycle: data.billingCycle,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
    } as CreateInput<CompanySubscription>;
  }

  static toUpdateEntity(data: {
    planId?: string;
    billingCycle?: BillingCycle;
    stripeStatus?: SubscriptionStatus;
    cancelAtPeriodEnd?: boolean;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    startDate?: Date;
    expiryDate?: Date;
    jobPostsUsed?: number;
    featuredJobsUsed?: number;
    applicantAccessUsed?: number;
    isActive?: boolean;
  }): Partial<CompanySubscription> {
    return {
      ...(data.planId !== undefined && { planId: data.planId }),
      ...(data.billingCycle !== undefined && { billingCycle: data.billingCycle }),
      ...(data.stripeStatus !== undefined && { stripeStatus: data.stripeStatus }),
      ...(data.cancelAtPeriodEnd !== undefined && { cancelAtPeriodEnd: data.cancelAtPeriodEnd }),
      ...(data.currentPeriodStart !== undefined && { currentPeriodStart: data.currentPeriodStart }),
      ...(data.currentPeriodEnd !== undefined && { currentPeriodEnd: data.currentPeriodEnd }),
      ...(data.startDate !== undefined && { startDate: data.startDate }),
      ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate }),
      ...(data.jobPostsUsed !== undefined && { jobPostsUsed: data.jobPostsUsed }),
      ...(data.featuredJobsUsed !== undefined && { featuredJobsUsed: data.featuredJobsUsed }),
      ...(data.applicantAccessUsed !== undefined && { applicantAccessUsed: data.applicantAccessUsed }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    } as Partial<CompanySubscription>;
  }
}

