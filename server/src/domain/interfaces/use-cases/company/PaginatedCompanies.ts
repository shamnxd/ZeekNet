import { CompanyProfile } from 'src/domain/entities/company-profile.entity';


export interface PaginatedCompanies {
  companies: CompanyProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
