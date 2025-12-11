import { PaginatedUsersResultDto } from 'src/application/dto/seeker/paginated-users-result.dto';
import { GetUsersQueryDto } from 'src/application/dto/seeker/get-users-query.dto';

export interface IGetAllUsersUseCase {
  execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto>;
}
