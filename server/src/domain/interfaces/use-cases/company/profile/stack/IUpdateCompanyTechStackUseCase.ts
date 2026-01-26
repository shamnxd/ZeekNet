import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { UpdateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';

export interface IUpdateCompanyTechStackUseCase {
  execute(dto: UpdateCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto>;
}

