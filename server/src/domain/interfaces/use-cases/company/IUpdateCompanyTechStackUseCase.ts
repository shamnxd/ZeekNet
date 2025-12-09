import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyTechStackData } from './CompanyTechStackData';

// be

export interface IUpdateCompanyTechStackUseCase {
  execute(techStackId: string, data: CompanyTechStackData): Promise<CompanyTechStack>;
}
