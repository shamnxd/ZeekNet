import { JobCategory } from '../../entities/job-category.entity';

export interface JobCategoryQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedJobCategories {
  data: JobCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IJobCategoryRepository {
  findById(id: string): Promise<JobCategory | null>;
  findByName(name: string): Promise<JobCategory | null>;
  create(data: { name: string }): Promise<JobCategory>;
  update(id: string, updates: { name: string }): Promise<JobCategory | null>;
  delete(id: string): Promise<boolean>;
  paginate(
    filter: Record<string, unknown>,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<PaginatedJobCategories>;
}