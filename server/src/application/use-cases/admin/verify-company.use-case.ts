import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IVerifyCompanyUseCase } from 'src/domain/interfaces/use-cases/admin/IVerifyCompanyUseCase';
import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';
import { CompanySubscriptionMapper } from '../../mappers/company/company-subscription.mapper';

export class VerifyCompanyUseCase implements IVerifyCompanyUseCase {
  constructor(
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(companyId: string, isVerified: CompanyVerificationStatus, rejectionReason?: string): Promise<void> {
    await this._companyVerificationRepository.updateVerificationStatus(companyId, isVerified, rejectionReason);

    if (isVerified === CompanyVerificationStatus.VERIFIED) {
      const defaultPlan = await this._subscriptionPlanRepository.findDefault();
      if (defaultPlan) {
        const existingSubscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyId);
        if (!existingSubscription) {
          const startDate = new Date();
          const expiryDate = new Date('2099-12-31');

          await this._companySubscriptionRepository.create(
            CompanySubscriptionMapper.toEntity({
              companyId,
              planId: defaultPlan.id,
              startDate,
              expiryDate,
              isActive: true,
              jobPostsUsed: 0,
              featuredJobsUsed: 0,
              applicantAccessUsed: 0,
            }),
          );
        }
      }
    }
  }
}

