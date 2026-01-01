import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { CreateCompanyBenefitsRequestDto } from '../../dtos/company/common/company-benefits.dto';
import { ICreateCompanyBenefitUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyBenefitUseCase';

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


