import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IDeleteCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IDeleteCompanyBenefitUseCase';
import { DeleteCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

export class DeleteCompanyBenefitUseCase implements IDeleteCompanyBenefitUseCase {
  constructor(
    private readonly _companyBenefitsRepository: ICompanyBenefitsRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: DeleteCompanyBenefitsRequestDto): Promise<void> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const existingBenefit = await this._companyBenefitsRepository.findById(dto.benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${dto.benefitId} not found`);
    }
    if (existingBenefit.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this benefit');
    }
    await this._companyBenefitsRepository.delete(dto.benefitId);
  }
}

