import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { BillingCycle } from '../../../domain/enums/billing-cycle.enum';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { ICreateCheckoutSessionUseCase } from '../../../domain/interfaces/use-cases/payments/ICreateCheckoutSessionUseCase';
import { CreateCheckoutSessionRequestDto } from '../../dto/company/create-checkout-session.dto';
import { CreateCheckoutSessionResponseDto } from '../../dto/company/checkout-session-response.dto';
import { StripeCheckoutMapper } from '../../mappers/stripe/stripe-checkout.mapper';

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto> {
    const { userId, planId, billingCycle, successUrl, cancelUrl } = data;
    if (!userId) throw new Error('User ID is required');
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    

    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (!plan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    const priceId = billingCycle === BillingCycle.YEARLY ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
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

    const session = await this._stripeService.createCheckoutSession(
      StripeCheckoutMapper.toCheckoutSessionParams({
        customerId: stripeCustomerId,
        priceId,
        successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl,
        metadata: StripeCheckoutMapper.toSessionMetadata({
          companyId: companyProfile.id,
          planId: plan.id,
          userId: userId,
          billingCycle,
        }),
        subscriptionMetadata: StripeCheckoutMapper.toSubscriptionMetadata({
          companyId: companyProfile.id,
          planId: plan.id,
          billingCycle,
        }),
      }),
    );

    return {
      sessionId: session.id,
      sessionUrl: session.url || '',
    } as CreateCheckoutSessionResponseDto;
  }
}
