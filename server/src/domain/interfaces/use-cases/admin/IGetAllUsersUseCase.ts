import { PaginatedUsersResultDto } from 'src/application/dtos/seeker/common/paginated-users-result.dto';
import { GetUsersQueryDto } from 'src/application/dtos/seeker/requests/get-users-query.dto';

export interface IGetAllUsersUseCase {
  execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto>;
}

