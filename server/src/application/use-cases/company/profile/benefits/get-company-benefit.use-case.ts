import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { IGetCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/IGetCompanyBenefitUseCase';
import { GetCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { CompanyBenefitMapper } from 'src/application/mappers/company/profile/company-benefit.mapper';

export class GetCompanyBenefitUseCase implements IGetCompanyBenefitUseCase {
  constructor(
    private readonly _companyBenefitsRepository: ICompanyBenefitsRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: GetCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto[]> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const benefits = await this._companyBenefitsRepository.findMany({ companyId });
    return CompanyBenefitMapper.toResponseList(benefits);
  }
}

