import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { UpdateCompanyBenefitsRequestDto } from '../../dtos/company/common/company-benefits.dto';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IUpdateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/IUpdateCompanyBenefitUseCase';

export class UpdateCompanyBenefitUseCase implements IUpdateCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefits> {
    const { companyId, benefitId } = data;
    const existingBenefit = await this._companyBenefitsRepository.findById(benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${benefitId} not found`);
    }
    if (existingBenefit.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this benefit');
    }
    const updatedBenefit = await this._companyBenefitsRepository.update(benefitId, data);
    if (!updatedBenefit) {
      throw new NotFoundError(`Failed to update company benefit with ID ${benefitId}`);
    }
    return updatedBenefit;
  }
}


