import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';

export interface IGetCompanyBenefitUseCase {
  execute(companyId: string): Promise<CompanyBenefits[]>;
}
