import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CreateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { ICreateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/ICreateCompanyBenefitUseCase';

export class CreateCompanyBenefitUseCase implements ICreateCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(data: CreateCompanyBenefitsRequestDto): Promise<CompanyBenefits> {
    const { companyId } = data;
    if (!companyId) {
      throw new Error('Company ID is required');
    }
    const benefit = CompanyBenefits.create({ ...data, companyId });
    return this._companyBenefitsRepository.create(benefit);
  }
}


