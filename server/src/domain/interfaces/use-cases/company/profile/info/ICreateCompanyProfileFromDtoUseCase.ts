import { CreateCompanyProfileFromDtoRequestDto } from 'src/application/dtos/company/profile/info/requests/create-company-profile-from-dto.dto';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

export interface ICreateCompanyProfileFromDtoUseCase {
  execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfileResponseDto>;
}

