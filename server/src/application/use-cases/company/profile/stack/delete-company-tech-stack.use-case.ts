import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IDeleteCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IDeleteCompanyTechStackUseCase';
import { DeleteCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

export class DeleteCompanyTechStackUseCase implements IDeleteCompanyTechStackUseCase {
  constructor(
    private readonly _companyTechStackRepository: ICompanyTechStackRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: DeleteCompanyTechStackRequestDto): Promise<void> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const existingTechStack = await this._companyTechStackRepository.findById(dto.techStackId);
    if (!existingTechStack) {
      throw new NotFoundError(`Company tech stack with ID ${dto.techStackId} not found`);
    }
    if (existingTechStack.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this tech stack');
    }
    await this._companyTechStackRepository.delete(dto.techStackId);
  }
}

