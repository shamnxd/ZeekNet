import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/company/common/paginated-companies-with-verification-result.dto';


export interface IGetPendingCompaniesUseCase {
  execute(): Promise<PaginatedCompaniesWithVerificationResultDto>;
}

