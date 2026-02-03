import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';

export interface PaginatedUsersResultDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
