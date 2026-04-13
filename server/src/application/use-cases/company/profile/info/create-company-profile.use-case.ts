import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { VALIDATION } from 'src/shared/constants/messages';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICreateCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/ICreateCompanyProfileUseCase';
import { CreateCompanyProfileRequestDtoType } from 'src/application/dtos/company/profile/info/requests/create-company-profile-request.dto';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

@injectable()
export class CreateCompanyProfileUseCase implements ICreateCompanyProfileUseCase {
  constructor(
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.CompanyContactRepository) private readonly _companyContactRepository: ICompanyContactRepository,
    @inject(TYPES.CompanyOfficeLocationRepository) private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    @inject(TYPES.CompanyVerificationRepository) private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.CompanySubscriptionRepository) private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) { }

  async execute(data: CreateCompanyProfileRequestDtoType): Promise<CompanyProfileResponseDto> {
    const { userId, ...profileData } = data;
    if (!userId) throw new Error(VALIDATION.REQUIRED('User ID'));
    const profile = await this._companyProfileRepository.create(
      CompanyProfileMapper.toEntity({
        userId,
        companyName: profileData.companyName,
        logo: profileData.logo,
        banner: profileData.banner,
        websiteLink: profileData.websiteLink,
        employeeCount: profileData.employeeCount,
        industry: profileData.industry,
        organisation: profileData.organisation,
        aboutUs: profileData.aboutUs,
        email: profileData.email,
      }),
    );

    let verification = null;
    if (profileData.taxId || profileData.businessLicenseUrl) {
      verification = await this._companyVerificationRepository.create({
        companyId: profile.id,
        taxId: profileData.taxId || '',
        businessLicenseUrl: profileData.businessLicenseUrl || '',
      });
    }

    if (profileData.email) {
      const contact = CompanyContact.create({
        companyId: profile.id,
        email: profileData.email,
      });
      await this._companyContactRepository.create(contact);
    }

    if (profileData.location) {
      const location = CompanyOfficeLocation.create({
        companyId: profile.id,
        location: profileData.location,
        isHeadquarters: true,
      });
      await this._companyOfficeLocationRepository.create(location);
    }

    const defaultPlan = await this._subscriptionPlanRepository.findDefault();
    if (defaultPlan) {
      await this._companySubscriptionRepository.create(
        CompanySubscriptionResponseMapper.toEntity({
          companyId: profile.id,
          planId: defaultPlan.id,
          startDate: null,
          expiryDate: null,
          isActive: true,
          jobPostsUsed: 0,
          featuredJobsUsed: 0,
          applicantAccessUsed: 0,
        }),
      );
    }

    return CompanyProfileMapper.toResponse(profile, verification);
  }
}
