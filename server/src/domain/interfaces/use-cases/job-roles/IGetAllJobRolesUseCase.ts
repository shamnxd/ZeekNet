import { GetAllJobRolesRequestDto } from 'src/application/dtos/admin/common/job-role-management.dto';
import { PaginatedJobRolesResultDto } from 'src/application/dtos/job-roles/common/paginated-job-roles-result.dto';

export interface IGetAllJobRolesUseCase {
  execute(options: GetAllJobRolesRequestDto): Promise<PaginatedJobRolesResultDto>;
}

