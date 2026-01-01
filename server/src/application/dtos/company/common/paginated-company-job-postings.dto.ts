import { CompanyJobPostingListItemDto } from '../../job-posting/common/job-posting-response.dto';

export interface PaginatedCompanyJobPostingsDto {
  jobs: CompanyJobPostingListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
