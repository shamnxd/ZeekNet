import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { UpdateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IUpdateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IUpdateCompanyBenefitUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { CompanyBenefitMapper } from 'src/application/mappers/company/profile/company-benefit.mapper';

export class UpdateCompanyBenefitUseCase implements IUpdateCompanyBenefitUseCase {
  constructor(
    private readonly _companyBenefitsRepository: ICompanyBenefitsRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, benefitId, ...updateData } = data;
    const existingBenefit = await this._companyBenefitsRepository.findById(benefitId);
    if (!existingBenefit) {
      throw new NotFoundError(`Company benefit with ID ${benefitId} not found`);
    }
    if (existingBenefit.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this benefit');
    }
    const updatedBenefit = await this._companyBenefitsRepository.update(benefitId, updateData);
    if (!updatedBenefit) {
      throw new NotFoundError(`Failed to update company benefit with ID ${benefitId}`);
    }
    return CompanyBenefitMapper.toResponse(updatedBenefit);
  }
}


