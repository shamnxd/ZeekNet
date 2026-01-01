import { PublicJobListItemDto } from '../../job-posting/common/job-posting-response.dto';

export interface PaginatedPublicJobsDto {
  jobs: PublicJobListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
