import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { CreateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';

export interface ICreateCompanyTechStackUseCase {
  execute(data: CreateCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto>;
}

