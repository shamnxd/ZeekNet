import { SimpleUpdateCompanyProfileRequestDto } from '../../dto/company/company-profile.dto';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { CompanyProfileResponseDto } from '../../dto/company/company-response.dto';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class UpdateCompanyProfileUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, data: { profile: SimpleUpdateCompanyProfileRequestDto }): Promise<CompanyProfileResponseDto> {
    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (!existingProfile) {
      throw new Error('Company profile not found');
    }

    if (data.profile) {
      const updatedProfile = await this._companyProfileRepository.update(existingProfile.id, {
        companyName: data.profile.company_name,
        logo: data.profile.logo,
        banner: data.profile.banner,
        websiteLink: data.profile.website_link,
        employeeCount: data.profile.employee_count,
        industry: data.profile.industry,
        organisation: data.profile.organisation || existingProfile.organisation,
        aboutUs: data.profile.about_us,
      });
    }

    const updatedProfile = await this._companyProfileRepository.findOne({ userId });
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    const verification = await this._companyVerificationRepository.findOne({ companyId: updatedProfile.id });
    
    const logoKey = updatedProfile.logo && !updatedProfile.logo.startsWith('http') ? updatedProfile.logo : null;
    const bannerKey = updatedProfile.banner && !updatedProfile.banner.startsWith('http') ? updatedProfile.banner : null;
    const businessLicenseKey = verification?.businessLicenseUrl && !verification.businessLicenseUrl.startsWith('http') 
      ? verification.businessLicenseUrl 
      : null;

    const [logoUrl, bannerUrl, businessLicenseUrl] = await Promise.all([
      logoKey ? this._s3Service.getSignedUrl(logoKey) : Promise.resolve(null),
      bannerKey ? this._s3Service.getSignedUrl(bannerKey) : Promise.resolve(null),
      businessLicenseKey ? this._s3Service.getSignedUrl(businessLicenseKey) : Promise.resolve(null),
    ]);

    return CompanyProfileMapper.toResponse(updatedProfile, verification, { logo: logoUrl, banner: bannerUrl, businessLicense: businessLicenseUrl });
  }
}

