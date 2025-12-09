import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyBenefitsData } from './CompanyBenefitsData';

// be

export interface IUpdateCompanyBenefitUseCase {
  execute(companyId: string, benefitId: string, data: CompanyBenefitsData): Promise<CompanyBenefits>;
}
