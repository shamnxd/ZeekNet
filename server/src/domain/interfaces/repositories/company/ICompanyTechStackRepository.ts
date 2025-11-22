import { CompanyTechStack } from '../../../entities/company-tech-stack.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyTechStackRepository extends IBaseRepository<CompanyTechStack> {
  // Use findMany({ companyId }) from base instead
}