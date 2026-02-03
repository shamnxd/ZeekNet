import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CreateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';
import { ICreateCompanyBenefitUseCase } from 'src/domain/interfaces/use-cases/company/profile/benefits/ICreateCompanyBenefitUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { CompanyBenefitMapper } from 'src/application/mappers/company/profile/company-benefit.mapper';

export class CreateCompanyBenefitUseCase implements ICreateCompanyBenefitUseCase {
  constructor(
    private readonly _companyBenefitsRepository: ICompanyBenefitsRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: CreateCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, ...benefitData } = data;
    const benefit = CompanyBenefits.create({ ...benefitData, companyId });
    const created = await this._companyBenefitsRepository.create(benefit);
    return CompanyBenefitMapper.toResponse(created);
  }
}


