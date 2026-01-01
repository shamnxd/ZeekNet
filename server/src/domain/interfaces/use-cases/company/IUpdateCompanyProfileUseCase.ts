import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dtos/company/common/company-profile.dto';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/responses/company-response.dto';


export interface IUpdateCompanyProfileUseCase {
  execute(data: SimpleUpdateCompanyProfileRequestDto): Promise<CompanyProfileResponseDto>;
}

