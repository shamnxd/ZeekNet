import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { GetCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';

export interface IGetCompanyTechStackUseCase {
  execute(dto: GetCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto[]>;
}
