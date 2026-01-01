import { CompanyWithVerificationResult } from 'src/application/dtos/admin/companies/responses/company-with-verification-result.dto';

export interface PaginatedCompaniesWithVerificationResultDto {
  companies: CompanyWithVerificationResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

