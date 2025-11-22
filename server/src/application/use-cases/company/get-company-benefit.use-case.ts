import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { IGetCompanyBenefitUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyBenefitUseCase implements IGetCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async executeByCompanyId(companyId: string): Promise<CompanyBenefits[]> {
    return this._companyBenefitsRepository.findMany({ companyId });
  }

  async executeById(benefitId: string): Promise<CompanyBenefits | null> {
    return this._companyBenefitsRepository.findById(benefitId);
  }
}

