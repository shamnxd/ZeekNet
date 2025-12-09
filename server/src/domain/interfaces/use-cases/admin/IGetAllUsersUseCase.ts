import { PaginatedUsers } from '../seeker/PaginatedUsers';
import { UserQueryOptions } from '../seeker/UserQueryOptions';

export interface IGetAllUsersUseCase {
  execute(options: UserQueryOptions): Promise<PaginatedUsers>;
}
