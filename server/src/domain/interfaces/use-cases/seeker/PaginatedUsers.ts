import { User } from 'src/domain/entities/user.entity';

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
