import { JobCategory } from 'src/domain/entities/job-category.entity';


export interface PaginatedJobCategories {
  categories: JobCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
