import { PublicJobListItemDto } from '../../job-posting/common/job-posting-response.dto';

export interface GetAllJobPostingsResponseDto {
  jobs: PublicJobListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
