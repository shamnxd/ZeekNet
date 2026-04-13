import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';
import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { IGetBillingPortalUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetBillingPortalUseCase';
import { GetBillingPortalRequestDto } from 'src/application/dtos/subscription/requests/get-billing-portal.dto';

@injectable()
export class GetBillingPortalUseCase implements IGetBillingPortalUseCase {
  constructor(
    @inject(TYPES.StripeService) private readonly _stripeService: IStripeService,
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.CompanySubscriptionRepository) private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(data: GetBillingPortalRequestDto): Promise<{ url: string }> {
    const { userId, returnUrl } = data;
    if (!userId) throw new Error(VALIDATION.REQUIRED('User ID'));
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
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

