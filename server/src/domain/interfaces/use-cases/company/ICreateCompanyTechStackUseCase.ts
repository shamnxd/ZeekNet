import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CreateCompanyTechStackRequestDto } from 'src/application/dto/company/company-tech-stack.dto';

export interface ICreateCompanyTechStackUseCase {
  execute(data: CreateCompanyTechStackRequestDto): Promise<CompanyTechStack>;
}
