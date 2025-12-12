import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { UpdateCompanyTechStackRequestDto } from 'src/application/dto/company/company-tech-stack.dto';

export interface IUpdateCompanyTechStackUseCase {
  execute(companyId: string, techStackId: string, data: UpdateCompanyTechStackRequestDto): Promise<CompanyTechStack>;
}
