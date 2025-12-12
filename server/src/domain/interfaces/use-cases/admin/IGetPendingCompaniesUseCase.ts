import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dto/company/paginated-companies-with-verification-result.dto';


export interface IGetPendingCompaniesUseCase {
  execute(): Promise<PaginatedCompaniesWithVerificationResultDto>;
}
