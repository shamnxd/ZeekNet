import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CreateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';

export interface ICreateCompanyTechStackUseCase {
  execute(data: CreateCompanyTechStackRequestDto): Promise<CompanyTechStack>;
}

