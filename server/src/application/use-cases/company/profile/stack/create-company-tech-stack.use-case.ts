import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CreateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { ICreateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/ICreateCompanyTechStackUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { CompanyTechStackMapper } from 'src/application/mappers/company/profile/company-tech-stack.mapper';

export class CreateCompanyTechStackUseCase implements ICreateCompanyTechStackUseCase {
  constructor(
    private readonly _companyTechStackRepository: ICompanyTechStackRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) { }

  async execute(data: CreateCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const techStack = CompanyTechStack.create({ techStack: data.name, companyId });
    const created = await this._companyTechStackRepository.create(techStack);
    return CompanyTechStackMapper.toResponse(created);
  }
}


