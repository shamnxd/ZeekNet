import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';

export interface PaginatedUsersResultDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
