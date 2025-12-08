import { JobRole } from 'src/domain/entities/job-role.entity';


export interface PaginatedJobRoles {
  jobRoles: JobRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
