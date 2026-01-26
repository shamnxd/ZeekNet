import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { IReapplyCompanyVerificationUseCase } from 'src/domain/interfaces/use-cases/company/profile/verification/IReapplyCompanyVerificationUseCase';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { ReapplyVerificationRequestDto } from 'src/application/dtos/company/profile/verification/requests/reapply-verification-request.dto';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';

export class ReapplyCompanyVerificationUseCase implements IReapplyCompanyVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
  ) { }

  async execute(data: ReapplyVerificationRequestDto): Promise<CompanyProfileResponseDto> {
    const { userId, company_name, email, website, industry, organisation, location, employees, description, logo, tax_id, business_license } = data;

    if (!userId) throw new Error('User ID is required');

    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (!existingProfile) {
      throw new Error('Company profile not found');
    }

    if (existingProfile.isVerified !== CompanyVerificationStatus.REJECTED) {
      throw new Error('Only rejected companies can reapply for verification');
    }

    const profileUpdates: Partial<{
      companyName: string;
      email: string;
      websiteLink: string;
      industry: string;
      organisation: string;
      employeeCount: number;
      aboutUs: string;
      logo: string;
      rejectionReason: undefined;
    }> = {};

    if (company_name) profileUpdates.companyName = company_name;
    if (email) profileUpdates.email = email;
    if (website) profileUpdates.websiteLink = website;
    if (industry) profileUpdates.industry = industry;
    if (organisation) profileUpdates.organisation = organisation;
    if (employees) profileUpdates.employeeCount = parseInt(employees);
    if (description) profileUpdates.aboutUs = description;
    if (logo) profileUpdates.logo = logo;

    if (Object.keys(profileUpdates).length > 0) {
      await this._companyProfileRepository.update(existingProfile.id, profileUpdates);
    }

    let verification = null;
    if (tax_id || business_license) {
      verification = await this._companyVerificationRepository.findOne({ companyId: existingProfile.id });
      if (verification) {
        verification = await this._companyVerificationRepository.update(verification.id, {
          taxId: tax_id,
          businessLicenseUrl: business_license,
        });
      }
    }

    if (location) {
      const existingLocation = await this._companyOfficeLocationRepository.findOne({ companyId: existingProfile.id, isHeadquarters: true });
      if (existingLocation) {
        await this._companyOfficeLocationRepository.update(existingLocation.id, {
          location: location,
        });
      }
    }

    await this._companyProfileRepository.update(existingProfile.id, {
      rejectionReason: undefined,
    });
    await this._companyVerificationRepository.updateVerificationStatus(existingProfile.id, CompanyVerificationStatus.PENDING);

    const updatedProfile = await this._companyProfileRepository.findOne({ userId });
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    return CompanyProfileMapper.toResponse(updatedProfile, verification);
  }
}
