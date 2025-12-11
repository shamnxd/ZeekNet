import { GetAllJobRolesRequestDto } from 'src/application/dto/admin/job-role-management.dto';
import { PaginatedJobRolesResultDto } from 'src/application/dto/job-roles/paginated-job-roles-result.dto';

export interface IGetAllJobRolesUseCase {
  execute(options: GetAllJobRolesRequestDto): Promise<PaginatedJobRolesResultDto>;
}
