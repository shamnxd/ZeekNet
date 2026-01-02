import { CompanyJobPostingListItemDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export interface PaginatedCompanyJobPostingsDto {
  jobs: CompanyJobPostingListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
