import { CompanyWithVerification } from './CompanyWithVerification';

export interface PaginatedCompaniesWithVerification {
  companies: CompanyWithVerification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
