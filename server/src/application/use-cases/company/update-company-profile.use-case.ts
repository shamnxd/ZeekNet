import { SimpleUpdateCompanyProfileRequestDto } from '../../dto/company/company-profile.dto';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { CompanyProfileResponseDto } from '../../dto/company/company-response.dto';

export class UpdateCompanyProfileUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

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

    return CompanyProfileMapper.toDto(updatedProfile);
  }
}

