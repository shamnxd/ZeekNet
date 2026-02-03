import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IVerifyCompanyUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IVerifyCompanyUseCase';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';
import { CompanySubscriptionMapper } from 'src/application/mappers/company/subscription/company-subscription.mapper';
import { VerifyCompanyRequestDto } from 'src/application/dtos/admin/companies/requests/verify-company-request.dto';

export class VerifyCompanyUseCase implements IVerifyCompanyUseCase {
  constructor(
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) { }

  async execute(dto: VerifyCompanyRequestDto): Promise<void> {
    const { companyId, isVerified, rejection_reason: rejectionReason } = dto;

    await this._companyVerificationRepository.updateVerificationStatus(
      companyId,
      isVerified as CompanyVerificationStatus,
      rejectionReason,
    );

    if (isVerified === 'verified') {
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

