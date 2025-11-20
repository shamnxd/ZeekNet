import { JobRole } from '../../../entities/job-role.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface JobRoleQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedJobRoles {
  jobRoles: JobRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IJobRoleRepository extends IBaseRepository<JobRole> {
  // Special method with case-insensitive regex matching
  findByName(name: string): Promise<JobRole | null>;
  // Complex pagination query
  findAllWithPagination(filters?: JobRoleQueryFilters): Promise<PaginatedJobRoles>;
}

