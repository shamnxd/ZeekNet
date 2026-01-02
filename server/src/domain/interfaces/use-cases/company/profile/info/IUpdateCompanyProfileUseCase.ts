import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dtos/company/profile/info/requests/company-profile.dto';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';


export interface IUpdateCompanyProfileUseCase {
  execute(data: SimpleUpdateCompanyProfileRequestDto): Promise<CompanyProfileResponseDto>;
}

