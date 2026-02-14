import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';

type CompanySubscriptionWithActiveJobCount = CompanySubscription & { activeJobCount?: number };

import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { SubscriptionStatus } from 'src/domain/enums/subscription-status.enum';
import { CreateInput } from 'src/domain/types/common.types';

export class CompanySubscriptionResponseMapper {
  static toDto(entity: CompanySubscription | CompanySubscriptionWithActiveJobCount): CompanySubscriptionResponseDto {
    const entityWithActiveJobCount = entity as CompanySubscriptionWithActiveJobCount;
    return {
      id: entity.id,
      companyId: entity.companyId,
      planId: entity.planId,
      plan: {
        id: entity.planId,
        name: entity.planName || '',
        jobPostLimit: entity.jobPostLimit || 0,
        featuredJobLimit: entity.featuredJobLimit || 0,
        applicantAccessLimit: (entity as CompanySubscription).applicantAccessLimit || 0,
        isDefault: entity.isDefault,
      },
      startDate: entity.startDate,
      expiryDate: entity.expiryDate,
      isActive: entity.isActive,
      jobPostsUsed: entity.jobPostsUsed,
      featuredJobsUsed: entity.featuredJobsUsed,
      applicantAccessUsed: entity.applicantAccessUsed,
      activeJobCount: entityWithActiveJobCount.activeJobCount ?? entity.jobPostsUsed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      stripeStatus: entity.stripeStatus,
      billingCycle: entity.billingCycle,
      cancelAtPeriodEnd: entity.cancelAtPeriodEnd,
      currentPeriodStart: entity.currentPeriodStart,
      currentPeriodEnd: entity.currentPeriodEnd,
      stripeSubscriptionId: entity.stripeSubscriptionId,
      stripeCustomerId: entity.stripeCustomerId,
    };
  }

  static toDtoArray(entities: CompanySubscription[]): CompanySubscriptionResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toResponse(entity: CompanySubscription | CompanySubscriptionWithActiveJobCount): CompanySubscriptionResponseDto {
    return this.toDto(entity);
  }

  static toResponseList(entities: CompanySubscription[]): CompanySubscriptionResponseDto[] {
    return this.toDtoArray(entities);
  }

  static toEntity(data: {
    companyId: string;
    planId: string;
    startDate?: Date | null;
    expiryDate?: Date | null;
    isActive?: boolean;
    jobPostsUsed?: number;
    featuredJobsUsed?: number;
    applicantAccessUsed?: number;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string | null;
    stripeStatus?: SubscriptionStatus | null;
    billingCycle?: 'monthly' | 'yearly' | null;
    cancelAtPeriodEnd?: boolean;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
  }): CreateInput<CompanySubscription> {
    return {
      companyId: data.companyId,
      planId: data.planId,
      startDate: data.startDate || null,
      expiryDate: data.expiryDate || null,
      isActive: data.isActive ?? true,
      jobPostsUsed: data.jobPostsUsed || 0,
      featuredJobsUsed: data.featuredJobsUsed || 0,
      applicantAccessUsed: data.applicantAccessUsed || 0,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId || undefined,
      stripeStatus: data.stripeStatus || undefined,
      billingCycle: data.billingCycle as BillingCycle | undefined,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      currentPeriodStart: data.currentPeriodStart || undefined,
      currentPeriodEnd: data.currentPeriodEnd || undefined,
    } as CreateInput<CompanySubscription>;
  }
}

