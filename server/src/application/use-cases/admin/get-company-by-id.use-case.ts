import { IGetCompaniesWithVerificationUseCase, IGetCompanyByIdUseCase, CompanyWithVerification } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyByIdUseCase implements IGetCompanyByIdUseCase {
  constructor(private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase) {}

  async execute(companyId: string): Promise<CompanyWithVerification> {
    const result = await this._getCompaniesWithVerificationUseCase.execute({
      page: 1,
      limit: 1,
    });

    const company = result.companies.find(c => c.id === companyId) || null;
    
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }
}

