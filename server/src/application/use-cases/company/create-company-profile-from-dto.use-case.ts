import { ICreateCompanyProfileUseCase, ICreateCompanyProfileFromDtoUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CreateCompanyProfileData } from 'src/domain/interfaces/use-cases/company/CreateCompanyProfileData';
import { SimpleCompanyProfileRequestDto } from '../../dto/company/create-company.dto';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export class CreateCompanyProfileFromDtoUseCase implements ICreateCompanyProfileFromDtoUseCase {
  constructor(private readonly _createCompanyProfileUseCase: ICreateCompanyProfileUseCase) {}

  async execute(userId: string, dto: SimpleCompanyProfileRequestDto): Promise<CompanyProfile> {
    const profileData: CreateCompanyProfileData = {
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

    return await this._createCompanyProfileUseCase.execute(userId, profileData);
  }
}

