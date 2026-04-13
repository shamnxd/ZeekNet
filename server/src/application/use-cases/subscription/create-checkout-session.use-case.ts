import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';
import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ICreateCheckoutSessionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICreateCheckoutSessionUseCase';
import { CreateCheckoutSessionRequestDto } from 'src/application/dtos/subscription/requests/create-checkout-session.dto';
import { CreateCheckoutSessionResponseDto } from 'src/application/dtos/subscription/responses/checkout-session-response.dto';
import { StripeCheckoutMapper } from 'src/application/mappers/payment/stripe/stripe-checkout.mapper';

@injectable()
export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(
    @inject(TYPES.StripeService) private readonly _stripeService: IStripeService,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.CompanySubscriptionRepository) private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto> {
    const { userId, planId, billingCycle, successUrl, cancelUrl } = data;
    if (!userId) throw new Error(VALIDATION.REQUIRED('User ID'));
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR.NOT_FOUND('User'));
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }



    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError(ERROR.NOT_FOUND('Subscription plan'));
    }

    if (!plan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    if (plan.isDefault || plan.price === 0) {
      throw new ValidationError('Checkout sessions are only available for paid plans. The default plan is automatically assigned.');
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

