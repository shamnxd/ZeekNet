import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { SubscriptionPlanResponseDto } from 'src/application/dtos/admin/subscription/responses/subscription-plan-response.dto';

export class SubscriptionPlanMapper {
  static toResponse(plan: SubscriptionPlan | null): SubscriptionPlanResponseDto | null {
    if (!plan) return null;
    
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      yearlyDiscount: plan.yearlyDiscount,
      features: plan.features,
      jobPostLimit: plan.jobPostLimit,
      featuredJobLimit: plan.featuredJobLimit,
      applicantAccessLimit: plan.applicantAccessLimit,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      isDefault: plan.isDefault,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      stripeProductId: plan.stripeProductId,
      stripePriceIdMonthly: plan.stripePriceIdMonthly,
      stripePriceIdYearly: plan.stripePriceIdYearly,
    };
  }

  static toResponseList(plans: SubscriptionPlan[]): SubscriptionPlanResponseDto[] {
    return plans.map((plan) => this.toResponse(plan)!);
  }
}
