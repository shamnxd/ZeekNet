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
  data: JobRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IJobRoleRepository extends IBaseRepository<JobRole> {
  findByName(name: string): Promise<JobRole | null>;
}

