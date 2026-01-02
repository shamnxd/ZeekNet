import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-with-verification-result.dto';


export interface IGetPendingCompaniesUseCase {
  execute(): Promise<PaginatedCompaniesWithVerificationResultDto>;
}

