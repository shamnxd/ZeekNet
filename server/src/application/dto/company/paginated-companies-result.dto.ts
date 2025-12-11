import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export interface PaginatedCompaniesResultDto {
  companies: CompanyProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

