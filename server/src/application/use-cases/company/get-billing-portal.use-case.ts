import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { IGetBillingPortalUseCase } from 'src/domain/interfaces/use-cases/ICompanyUseCases';
import { GetBillingPortalRequestDto } from '../../dto/company/get-billing-portal.dto';

export class GetBillingPortalUseCase implements IGetBillingPortalUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(data: GetBillingPortalRequestDto): Promise<{ url: string }> {
    const { userId, returnUrl } = data;
    if (!userId) throw new Error('User ID is required');
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const subscriptions = await this._companySubscriptionRepository.findByCompanyId(companyProfile.id);
    const subscriptionWithCustomer = subscriptions.find(sub => sub.stripeCustomerId);

    if (!subscriptionWithCustomer?.stripeCustomerId) {
      throw new ValidationError('No Stripe customer found. Please subscribe to a plan first.');
    }

    const session = await this._stripeService.createBillingPortalSession(
      subscriptionWithCustomer.stripeCustomerId,
      returnUrl,
    );

    return {
      url: session.url,
    };
  }
}
