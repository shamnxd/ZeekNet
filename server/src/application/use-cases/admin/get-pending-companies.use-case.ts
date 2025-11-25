import { IGetCompaniesWithVerificationUseCase, IGetPendingCompaniesUseCase, PaginatedCompaniesWithVerification } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class GetPendingCompaniesUseCase implements IGetPendingCompaniesUseCase {
  constructor(private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase) {}

  async execute(): Promise<PaginatedCompaniesWithVerification> {
    // Business logic: Get pending companies with default pagination
    return await this._getCompaniesWithVerificationUseCase.execute({
      page: 1,
      limit: 100,
      isVerified: 'pending',
    });
  }
}

