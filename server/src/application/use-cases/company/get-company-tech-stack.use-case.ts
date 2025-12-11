import { ICompanyTechStackRepository } from '../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from '../../../domain/entities/company-tech-stack.entity';
import { IGetCompanyTechStackUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyTechStackUseCase';

export class GetCompanyTechStackUseCase implements IGetCompanyTechStackUseCase {
  constructor(private readonly _companyTechStackRepository: ICompanyTechStackRepository) {}

  async execute(companyId: string): Promise<CompanyTechStack[]> {
    return this._companyTechStackRepository.findMany({ companyId });
  }
}

