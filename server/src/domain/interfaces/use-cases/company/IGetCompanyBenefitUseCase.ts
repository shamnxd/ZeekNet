import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';

// be

export interface IGetCompanyBenefitUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyBenefits[]>;
  executeById(benefitId: string): Promise<CompanyBenefits | null>;
}
