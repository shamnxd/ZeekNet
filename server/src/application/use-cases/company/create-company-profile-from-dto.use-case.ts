import { ICreateCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyProfileUseCase';
import { ICreateCompanyProfileFromDtoUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyProfileFromDtoUseCase';
import { CreateCompanyProfileFromDtoRequestDto } from '../../dtos/company/requests/create-company-profile-from-dto.dto';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { CompanyProfileMapper } from '../../mappers/company/company-profile.mapper';

export class CreateCompanyProfileFromDtoUseCase implements ICreateCompanyProfileFromDtoUseCase {
  constructor(private readonly _createCompanyProfileUseCase: ICreateCompanyProfileUseCase) {}
  async execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfile> {
    const { userId, ...dto } = data;
    if (!userId) throw new Error('User ID is required');

    const profileData = CompanyProfileMapper.fromDto(dto);

    return await this._createCompanyProfileUseCase.execute({ ...profileData, userId });
  }
}



