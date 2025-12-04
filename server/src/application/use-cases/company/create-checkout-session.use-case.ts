import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

interface CreateCheckoutSessionResult {
  sessionId: string;
  sessionUrl: string;
}

export class CreateCheckoutSessionUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    successUrl: string,
    cancelUrl: string,
  ): Promise<CreateCheckoutSessionResult> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const existingSubscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (existingSubscription && !existingSubscription.cancelAtPeriodEnd) {
      throw new ValidationError('You already have an active subscription. Please cancel it first or wait for it to expire.');
    }

    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (!plan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    const priceId = billingCycle === 'yearly' ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
    if (!priceId) {
      throw new ValidationError(`This plan does not have ${billingCycle} pricing configured in Stripe`);
    }

    let stripeCustomerId: string;

    const previousSubscriptions = await this._companySubscriptionRepository.findByCompanyId(companyProfile.id);
    const subscriptionWithCustomer = previousSubscriptions.find(sub => sub.stripeCustomerId);

    if (subscriptionWithCustomer?.stripeCustomerId) {
      const existingCustomer = await this._stripeService.getCustomer(subscriptionWithCustomer.stripeCustomerId);
      if (existingCustomer) {
        stripeCustomerId = subscriptionWithCustomer.stripeCustomerId;
      } else {
        const newCustomer = await this._stripeService.createCustomer({
          email: user.email,
          name: companyProfile.companyName,
          metadata: {
            companyId: companyProfile.id,
            userId: userId,
          },
        });
        stripeCustomerId = newCustomer.id;
      }
    } else {
      const newCustomer = await this._stripeService.createCustomer({
        email: user.email,
        name: companyProfile.companyName,
        metadata: {
          companyId: companyProfile.id,
          userId: userId,
        },
      });
      stripeCustomerId = newCustomer.id;
    }

    const session = await this._stripeService.createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl,
      metadata: {
        companyId: companyProfile.id,
        planId: plan.id,
        userId: userId,
        billingCycle,
      },
      subscriptionMetadata: {
        companyId: companyProfile.id,
        planId: plan.id,
        billingCycle,
      },
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url || '',
    };
  }
}
