import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyBenefitsData } from './CompanyBenefitsData';

// be

export interface ICreateCompanyBenefitUseCase {
  execute(companyId: string, data: CompanyBenefitsData): Promise<CompanyBenefits>;
}
