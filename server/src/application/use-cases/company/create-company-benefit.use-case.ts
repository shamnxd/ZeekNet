import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { CreateCompanyBenefitsRequestDto } from '../../dto/company/company-benefits.dto';
import { ICreateCompanyBenefitUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class CreateCompanyBenefitUseCase implements ICreateCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(companyId: string, data: CreateCompanyBenefitsRequestDto): Promise<CompanyBenefits> {
    const benefit = CompanyBenefits.create({ ...data, companyId });
    return this._companyBenefitsRepository.create(benefit);
  }
}

