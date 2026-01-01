import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { SubscriptionStatus } from '../../../domain/enums/subscription-status.enum';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { IResumeSubscriptionUseCase } from '../../../domain/interfaces/use-cases/subscriptions/IResumeSubscriptionUseCase';

export class ResumeSubscriptionUseCase implements IResumeSubscriptionUseCase {
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
      throw new ValidationError('This subscription cannot be resumed through Stripe');
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new ValidationError('Subscription is not set to cancel');
    }

    const stripeSubscription = await this._stripeService.resumeSubscription(subscription.stripeSubscriptionId);

    const updatedSubscription = await this._companySubscriptionRepository.update(subscription.id, {
      cancelAtPeriodEnd: false,
      stripeStatus: stripeSubscription.status as SubscriptionStatus,
    });

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription');
    }

    return updatedSubscription;
  }
}

