import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';
import { IGetPendingCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetPendingCompaniesUseCase';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompaniesWithVerificationUseCase';
import { PaginatedCompaniesWithVerificationResultDto } from '../../dtos/company/common/paginated-companies-with-verification-result.dto';

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


