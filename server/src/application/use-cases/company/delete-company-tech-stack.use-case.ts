import { ICompanyTechStackRepository } from '../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { IDeleteCompanyTechStackUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class DeleteCompanyTechStackUseCase implements IDeleteCompanyTechStackUseCase {
  constructor(private readonly _companyTechStackRepository: ICompanyTechStackRepository) {}

  async execute(techStackId: string): Promise<void> {
    const existingTechStack = await this._companyTechStackRepository.findById(techStackId);
    if (!existingTechStack) {
      throw new NotFoundError(`Company tech stack with ID ${techStackId} not found`);
    }
    await this._companyTechStackRepository.delete(techStackId);
  }
}

