import { IGetCompanyByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompanyByIdUseCase';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompaniesWithVerificationUseCase';
import { CompanyWithVerificationResult } from '../../dto/company/company-with-verification-result.dto';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyByIdUseCase implements IGetCompanyByIdUseCase {
  constructor(private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase) {}

  async execute(companyId: string): Promise<CompanyWithVerificationResult> {
    const result = await this._getCompaniesWithVerificationUseCase.execute({
      page: 1,
      limit: 1,
      sortOrder: 'desc' as const,
    });

    const company = result.companies.find(c => c.id === companyId) || null;
    
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }
}

