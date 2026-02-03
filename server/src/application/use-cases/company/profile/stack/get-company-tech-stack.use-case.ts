import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { IGetCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IGetCompanyTechStackUseCase';
import { GetCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { CompanyTechStackMapper } from 'src/application/mappers/company/profile/company-tech-stack.mapper';

export class GetCompanyTechStackUseCase implements IGetCompanyTechStackUseCase {
  constructor(
    private readonly _companyTechStackRepository: ICompanyTechStackRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: GetCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto[]> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const techStacks = await this._companyTechStackRepository.findMany({ companyId });
    return CompanyTechStackMapper.toResponseList(techStacks);
  }
}

