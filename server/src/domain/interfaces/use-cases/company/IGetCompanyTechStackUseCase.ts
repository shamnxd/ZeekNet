import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';

export interface IGetCompanyTechStackUseCase {
  execute(companyId: string): Promise<CompanyTechStack[]>;
}
