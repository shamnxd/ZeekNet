import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dtos/company/profile/info/requests/company-profile.dto';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IUpdateCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IUpdateCompanyProfileUseCase';

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
    const updateData = CompanyProfileMapper.toUpdateEntity(profileData);
    
    if (Object.keys(updateData).length > 0) {
      await this._companyProfileRepository.update(existingProfile.id, updateData);
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



