import { GetAllJobRolesRequestDto } from 'src/application/dto/admin/job-role-management.dto';
import { PaginatedJobRoles } from './PaginatedJobRoles';

export interface IGetAllJobRolesUseCase {
  execute(options: GetAllJobRolesRequestDto): Promise<PaginatedJobRoles>;
}
