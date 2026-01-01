import { JobCategory } from '../../../../domain/entities/job-category.entity';

export interface PaginatedJobCategoriesResultDto {
  data: JobCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
