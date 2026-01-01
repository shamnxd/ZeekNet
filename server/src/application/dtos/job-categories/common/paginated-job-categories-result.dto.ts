import { JobCategory } from '../../../../domain/entities/job-category.entity';

export interface PaginatedJobCategoriesResultDto {
  categories: JobCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


