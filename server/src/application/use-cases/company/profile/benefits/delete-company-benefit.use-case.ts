import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IDeleteCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IDeleteCompanyBenefitUseCase';


export class DeleteCompanyBenefitUseCase implements IDeleteCompanyBenefitUseCase {
  constructor(private readonly _companyBenefitsRepository: ICompanyBenefitsRepository) {}

  async execute(companyId: string, benefitId: string): Promise<void> {
    const existingBenefit = await this._companyBenefitsRepository.findById(benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${benefitId} not found`);
    }
    if (existingBenefit.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this benefit');
    }
    await this._companyBenefitsRepository.delete(benefitId);
  }
}

