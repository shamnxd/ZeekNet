import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { SubscriptionStatus } from 'src/domain/enums/subscription-status.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { IResumeSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IResumeSubscriptionUseCase';
import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class ResumeSubscriptionUseCase implements IResumeSubscriptionUseCase {
  constructor(
    @inject(TYPES.StripeService) private readonly _stripeService: IStripeService,
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.CompanySubscriptionRepository) private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<CompanySubscriptionResponseDto> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
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
      throw new Error(ERROR.FAILED_TO('update subscription'));
    }

    return CompanySubscriptionResponseMapper.toDto(updatedSubscription);
  }
}

