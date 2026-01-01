import { GetAllJobRolesRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/get-all-job-roles-query.dto';
import { PaginatedJobRolesResultDto } from 'src/application/dtos/admin/attributes/job-roles/responses/paginated-job-roles-result.dto';

export interface IGetAllJobRolesUseCase {
  execute(options: GetAllJobRolesRequestDto): Promise<PaginatedJobRolesResultDto>;
}

