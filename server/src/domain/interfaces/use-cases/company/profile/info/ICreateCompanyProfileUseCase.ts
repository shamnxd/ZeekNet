import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CreateCompanyProfileRequestDtoType } from 'src/application/dtos/company/profile/info/requests/create-company-profile-request.dto';

export interface ICreateCompanyProfileUseCase {
  execute(data: CreateCompanyProfileRequestDtoType): Promise<CompanyProfileResponseDto>;
}

