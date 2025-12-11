import { ICompanyTechStackRepository } from '../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from '../../../domain/entities/company-tech-stack.entity';
import { UpdateCompanyTechStackRequestDto } from '../../dto/company/company-tech-stack.dto';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IUpdateCompanyTechStackUseCase } from '../../../domain/interfaces/use-cases/company/IUpdateCompanyTechStackUseCase';

export class UpdateCompanyTechStackUseCase implements IUpdateCompanyTechStackUseCase {
  constructor(private readonly _companyTechStackRepository: ICompanyTechStackRepository) {}

  async execute(companyId: string, techStackId: string, data: UpdateCompanyTechStackRequestDto): Promise<CompanyTechStack> {
    const existingTechStack = await this._companyTechStackRepository.findById(techStackId);
    if (!existingTechStack) {
      throw new NotFoundError(`Company tech stack with ID ${techStackId} not found`);
    }
    if (existingTechStack.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this tech stack');
    }
    const updatedTechStack = await this._companyTechStackRepository.update(techStackId, data);
    if (!updatedTechStack) {
      throw new NotFoundError(`Failed to update company tech stack with ID ${techStackId}`);
    }
    return updatedTechStack;
  }
}

