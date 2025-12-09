import { CompanyQueryOptions } from '../company/CompanyQueryOptions';
import { PaginatedCompaniesWithVerification } from '../company/PaginatedCompaniesWithVerification';

export interface IGetCompaniesWithVerificationUseCase {
  execute(options: CompanyQueryOptions): Promise<PaginatedCompaniesWithVerification>;
}
