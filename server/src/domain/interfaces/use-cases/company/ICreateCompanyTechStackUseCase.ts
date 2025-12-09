import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyTechStackData } from './CompanyTechStackData';

// be

export interface ICreateCompanyTechStackUseCase {
  execute(companyId: string, data: CompanyTechStackData): Promise<CompanyTechStack>;
}
