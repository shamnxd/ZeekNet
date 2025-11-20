import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { IDeleteCompanyBenefitUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class DeleteCompanyBenefitUseCase implements IDeleteCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(benefitId: string): Promise<void> {
    const existingBenefit = await this._companyBenefitsRepository.findById(benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${benefitId} not found`);
    }
    await this._companyBenefitsRepository.delete(benefitId);
  }
}

