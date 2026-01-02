import { JobRoleDto } from 'src/application/dtos/admin/attributes/job-roles/common/job-role.dto';

export interface PaginatedJobRolesResultDto {
  roles: JobRoleDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
