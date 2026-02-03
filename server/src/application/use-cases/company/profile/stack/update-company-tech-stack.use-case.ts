import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { UpdateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IUpdateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IUpdateCompanyTechStackUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';
import { CompanyTechStackMapper } from 'src/application/mappers/company/profile/company-tech-stack.mapper';

export class UpdateCompanyTechStackUseCase implements IUpdateCompanyTechStackUseCase {
  constructor(
    private readonly _companyTechStackRepository: ICompanyTechStackRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) { }

  async execute(dto: UpdateCompanyTechStackRequestDto): Promise<CompanyTechStackResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const existingTechStack = await this._companyTechStackRepository.findById(dto.techStackId);
    if (!existingTechStack) {
      throw new NotFoundError(`Company tech stack with ID ${dto.techStackId} not found`);
    }
    if (existingTechStack.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this tech stack');
    }
    const updatedTechStack = await this._companyTechStackRepository.update(dto.techStackId, { techStack: dto.name });
    if (!updatedTechStack) {
      throw new NotFoundError(`Failed to update company tech stack with ID ${dto.techStackId}`);
    }
    return CompanyTechStackMapper.toResponse(updatedTechStack);
  }
}


