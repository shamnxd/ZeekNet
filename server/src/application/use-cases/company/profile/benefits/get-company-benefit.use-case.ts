import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { IGetCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IGetCompanyBenefitUseCase';

export class GetCompanyBenefitUseCase implements IGetCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(companyId: string): Promise<CompanyBenefits[]> {
    return this._companyBenefitsRepository.findMany({ companyId });
  }
}

