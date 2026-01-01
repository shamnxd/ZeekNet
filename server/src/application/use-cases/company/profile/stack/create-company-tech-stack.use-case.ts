import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CreateCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';
import { ICreateCompanyTechStackUseCase } from 'src/domain/interfaces/use-cases/company/profile/stack/ICreateCompanyTechStackUseCase';

export class CreateCompanyTechStackUseCase implements ICreateCompanyTechStackUseCase {
  constructor(private readonly _companyTechStackRepository: ICompanyTechStackRepository) {}

  async execute(data: CreateCompanyTechStackRequestDto): Promise<CompanyTechStack> {
    const { companyId } = data;
    if (!companyId) {
      throw new Error('Company ID is required');
    }
    const techStack = CompanyTechStack.create({ ...data, companyId });
    return this._companyTechStackRepository.create(techStack);
  }
}


