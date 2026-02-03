import { ICreateCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/ICreateCompanyProfileUseCase';
import { ICreateCompanyProfileFromDtoUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/ICreateCompanyProfileFromDtoUseCase';
import { CreateCompanyProfileFromDtoRequestDto } from 'src/application/dtos/company/profile/info/requests/create-company-profile-from-dto.dto';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';

export class CreateCompanyProfileFromDtoUseCase implements ICreateCompanyProfileFromDtoUseCase {
  constructor(private readonly _createCompanyProfileUseCase: ICreateCompanyProfileUseCase) {}
  async execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfileResponseDto> {
    const { userId, ...dto } = data;
    if (!userId) throw new Error('User ID is required');

    const profileData = CompanyProfileMapper.fromDto(dto);

    return await this._createCompanyProfileUseCase.execute({ ...profileData, userId });
  }
}



