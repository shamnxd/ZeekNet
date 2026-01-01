import { CompanyJobPostingListItemDto } from '../../job-posting/common/job-posting-response.dto';

export interface GetCompanyJobPostingsResponseDto {
  jobs: CompanyJobPostingListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
