import { ICreateCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyProfileUseCase';
import { ICreateCompanyProfileFromDtoUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyProfileFromDtoUseCase';
import { CreateCompanyProfileRequestDtoType } from '../../dto/company/create-company-profile-request.dto';
import { CreateCompanyProfileFromDtoRequestDto } from '../../dto/company/create-company-profile-from-dto.dto';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export class CreateCompanyProfileFromDtoUseCase implements ICreateCompanyProfileFromDtoUseCase {
  constructor(private readonly _createCompanyProfileUseCase: ICreateCompanyProfileUseCase) {}

  async execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfile> {
    const { userId, ...dto } = data;
    if (!userId) throw new Error('User ID is required');
    const profileData: CreateCompanyProfileRequestDtoType = {
      companyName: dto.company_name,
      logo: dto.logo || '/default-logo.png',
      banner: '/default-banner.png',
      websiteLink: dto.website || '',
      employeeCount: parseInt(dto.employees),
      industry: dto.industry,
      organisation: dto.organisation,
      aboutUs: dto.description,
      taxId: dto.tax_id,
      businessLicenseUrl: dto.business_license,
      email: dto.email,
      location: dto.location,
    };

    return await this._createCompanyProfileUseCase.execute({ ...profileData, userId });
  }
}

