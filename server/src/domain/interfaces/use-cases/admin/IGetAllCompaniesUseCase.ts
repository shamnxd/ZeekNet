import { CompanyQueryOptions } from '../company/CompanyQueryOptions';
import { PaginatedCompanies } from '../company/PaginatedCompanies';

export interface IGetAllCompaniesUseCase {
  execute(options: CompanyQueryOptions): Promise<PaginatedCompanies>;
}
