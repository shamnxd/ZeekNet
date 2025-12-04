import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { CompanySubscriptionResponseDto } from '../../dto/subscription/subscription-response.dto';

export class CompanySubscriptionResponseMapper {
  static toDto(entity: CompanySubscription): CompanySubscriptionResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      plan: {
        id: entity.planId,
        name: entity.planName || '',
        jobPostLimit: entity.jobPostLimit || 0,
        featuredJobLimit: entity.featuredJobLimit || 0,
        applicantAccessLimit: 0,
      },
      startDate: entity.startDate,
      expiryDate: entity.expiryDate,
      isActive: entity.isActive,
      jobPostsUsed: entity.jobPostsUsed,
      featuredJobsUsed: entity.featuredJobsUsed,
      applicantAccessUsed: entity.applicantAccessUsed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      // Stripe-specific fields
      stripeStatus: entity.stripeStatus,
      billingCycle: entity.billingCycle,
      cancelAtPeriodEnd: entity.cancelAtPeriodEnd,
      currentPeriodStart: entity.currentPeriodStart,
      currentPeriodEnd: entity.currentPeriodEnd,
    };
  }

  static toDtoArray(entities: CompanySubscription[]): CompanySubscriptionResponseDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
