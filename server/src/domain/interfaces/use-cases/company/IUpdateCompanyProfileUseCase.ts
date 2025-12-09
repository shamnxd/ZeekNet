import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dto/company/company-profile.dto';
import { CompanyProfileResponseDto } from 'src/application/dto/company/company-response.dto';


export interface IUpdateCompanyProfileUseCase {
  execute(data: SimpleUpdateCompanyProfileRequestDto): Promise<CompanyProfileResponseDto>;
}
