import { PublicJobListItemDto } from '../job-posting/job-posting-response.dto';

export interface GetAllJobPostingsResponseDto {
  jobs: PublicJobListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
