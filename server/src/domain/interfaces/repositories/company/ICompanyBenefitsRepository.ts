import { CompanyBenefits } from '../../../entities/company-benefits.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyBenefitsRepository extends IBaseRepository<CompanyBenefits> {
  // Use findMany({ companyId }) from base instead
}