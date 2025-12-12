import { User } from '../../../domain/entities/user.entity';

export interface PaginatedUsersResultDto {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

