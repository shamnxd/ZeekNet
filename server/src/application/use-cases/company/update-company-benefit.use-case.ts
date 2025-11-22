import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { UpdateCompanyBenefitsRequestDto } from '../../dto/company/company-benefits.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { IUpdateCompanyBenefitUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class UpdateCompanyBenefitUseCase implements IUpdateCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(benefitId: string, data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefits> {
    const existingBenefit = await this._companyBenefitsRepository.findById(benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${benefitId} not found`);
    }
    const updatedBenefit = await this._companyBenefitsRepository.update(benefitId, data);
    if (!updatedBenefit) {
      throw new NotFoundError(`Failed to update company benefit with ID ${benefitId}`);
    }
    return updatedBenefit;
  }
}

