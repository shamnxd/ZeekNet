import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';

// be

export interface IGetCompanyTechStackUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyTechStack[]>;
  executeById(techStackId: string): Promise<CompanyTechStack | null>;
}
