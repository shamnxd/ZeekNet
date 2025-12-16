import { SimpleUpdateCompanyProfileRequestDto } from '../../dto/company/company-profile.dto';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { CompanyProfileResponseDto } from '../../dto/company/company-response.dto';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IUpdateCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/IUpdateCompanyProfileUseCase';

export class UpdateCompanyProfileUseCase implements IUpdateCompanyProfileUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(data: SimpleUpdateCompanyProfileRequestDto): Promise<CompanyProfileResponseDto> {
    const { userId, ...profileData } = data;
    if (!userId) throw new Error('User ID is required');
    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (!existingProfile) {
      throw new Error('Company profile not found');
    }
// be

    if (profileData.company_name || profileData.logo || profileData.banner || profileData.website_link || profileData.employee_count || profileData.industry || profileData.organisation || profileData.about_us) {
      const updatedProfile = await this._companyProfileRepository.update(existingProfile.id, {
        companyName: profileData.company_name,
        logo: profileData.logo,
        banner: profileData.banner,
        websiteLink: profileData.website_link,
        employeeCount: profileData.employee_count,
        industry: profileData.industry,
        organisation: profileData.organisation || existingProfile.organisation,
        aboutUs: profileData.about_us,
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

