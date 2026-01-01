import { JobRole } from '../../../../domain/entities/job-role.entity';

export interface PaginatedJobRolesResultDto {
  data: JobRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
