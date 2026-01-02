import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';
import { IGetPendingCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetPendingCompaniesUseCase';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompaniesWithVerificationUseCase';
import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-with-verification-result.dto';

export class GetPendingCompaniesUseCase implements IGetPendingCompaniesUseCase {
  constructor(private readonly _getCompaniesWithVerificationUseCase: IGetCompaniesWithVerificationUseCase) {}

  async execute(): Promise<PaginatedCompaniesWithVerificationResultDto> {
    return await this._getCompaniesWithVerificationUseCase.execute({
      page: 1,
      limit: 100,
      isVerified: CompanyVerificationStatus.PENDING,
      sortOrder: 'desc' as const,
    });
  }
}


