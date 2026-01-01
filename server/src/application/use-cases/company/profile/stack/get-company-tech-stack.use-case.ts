import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { IGetCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/IGetCompanyTechStackUseCase';

export class GetCompanyTechStackUseCase implements IGetCompanyTechStackUseCase {
  constructor(private readonly _companyTechStackRepository: ICompanyTechStackRepository) {}

  async execute(companyId: string): Promise<CompanyTechStack[]> {
    return this._companyTechStackRepository.findMany({ companyId });
  }
}

