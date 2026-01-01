import { PublicJobListItemDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export interface PaginatedPublicJobsDto {
  jobs: PublicJobListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
