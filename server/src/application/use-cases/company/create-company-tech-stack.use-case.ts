import { ICompanyTechStackRepository } from '../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from '../../../domain/entities/company-tech-stack.entity';
import { CreateCompanyTechStackRequestDto } from '../../dto/company/company-tech-stack.dto';
import { ICreateCompanyTechStackUseCase } from '../../../domain/interfaces/use-cases/company/ICreateCompanyTechStackUseCase';

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

