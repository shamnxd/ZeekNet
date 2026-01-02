import { CompanyProfileDto } from 'src/application/dtos/company/profile/common/company-profile-fragments.dto';

export interface PaginatedCompaniesResultDto {
  companies: CompanyProfileDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
