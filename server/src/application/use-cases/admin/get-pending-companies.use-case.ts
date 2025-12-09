import { IGetPendingCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetPendingCompaniesUseCase';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompaniesWithVerificationUseCase';
import { PaginatedCompaniesWithVerification } from 'src/domain/interfaces/use-cases/company/PaginatedCompaniesWithVerification';

export class GetPendingCompaniesUseCase implements IGetPendingCompaniesUseCase {
  constructor(private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase) {}

  async execute(): Promise<PaginatedCompaniesWithVerification> {
    return await this._getCompaniesWithVerificationUseCase.execute({
      page: 1,
      limit: 100,
      isVerified: 'pending',
    });
  }
}

