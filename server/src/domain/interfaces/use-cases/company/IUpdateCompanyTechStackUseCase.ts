import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { UpdateCompanyTechStackRequestDto } from 'src/application/dtos/company/common/company-tech-stack.dto';

export interface IUpdateCompanyTechStackUseCase {
  execute(companyId: string, techStackId: string, data: UpdateCompanyTechStackRequestDto): Promise<CompanyTechStack>;
}

