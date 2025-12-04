import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

interface ChangeSubscriptionResult {
  subscription: CompanySubscription;
  prorationAmount?: number;
}

export class ChangeSubscriptionPlanUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(
    userId: string,
    newPlanId: string,
    billingCycle?: 'monthly' | 'yearly',
  ): Promise<ChangeSubscriptionResult> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new ValidationError('This subscription cannot be changed through Stripe');
    }

    const newPlan = await this._subscriptionPlanRepository.findById(newPlanId);
    if (!newPlan) {
      throw new NotFoundError('New subscription plan not found');
    }

    if (!newPlan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    if (newPlan.id === subscription.planId && billingCycle === subscription.billingCycle) {
      throw new ValidationError('You are already on this plan with this billing cycle');
    }

    const effectiveBillingCycle = billingCycle || subscription.billingCycle || 'monthly';
    
    const priceId = effectiveBillingCycle === 'yearly' 
      ? newPlan.stripePriceIdYearly 
      : newPlan.stripePriceIdMonthly;

    if (!priceId) {
      throw new ValidationError(`This plan does not have ${effectiveBillingCycle} pricing configured`);
    }

    const stripeSubscription = await this._stripeService.updateSubscription({
      subscriptionId: subscription.stripeSubscriptionId,
      priceId,
      prorationBehavior: 'create_prorations',
    });

    const updatedSubscription = await this._companySubscriptionRepository.update(subscription.id, {
      planId: newPlan.id,
      billingCycle: effectiveBillingCycle,
      stripeStatus: stripeSubscription.status as 'active' | 'past_due' | 'canceled',
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    });

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription');
    }

    return {
      subscription: updatedSubscription,
    };
  }
}
