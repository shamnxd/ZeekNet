import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { ICancelSubscriptionUseCase } from '../../../domain/interfaces/use-cases/subscriptions/ICancelSubscriptionUseCase';

export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<CompanySubscription> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new ValidationError('This subscription cannot be canceled through Stripe');
    }

    if (subscription.cancelAtPeriodEnd) {
      throw new ValidationError('Subscription is already set to cancel at the end of the billing period');
    }

    const stripeSubscription = await this._stripeService.cancelSubscription(
      subscription.stripeSubscriptionId,
      true,
    );

    const updatedSubscription = await this._companySubscriptionRepository.update(subscription.id, {
      cancelAtPeriodEnd: true,
      stripeStatus: stripeSubscription.status as 'active' | 'past_due' | 'canceled',
    });

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription');
    }

    return updatedSubscription;
  }
}
