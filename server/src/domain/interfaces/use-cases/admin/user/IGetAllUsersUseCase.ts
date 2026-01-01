import { PaginatedUsersResultDto } from 'src/application/dtos/admin/user/responses/paginated-users-result.dto';
import { GetUsersQueryDto } from 'src/application/dtos/admin/user/requests/get-users-query.dto';

export interface IGetAllUsersUseCase {
  execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto>;
}

