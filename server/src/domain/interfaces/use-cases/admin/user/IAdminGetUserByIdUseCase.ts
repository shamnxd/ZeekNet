import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';

export interface IAdminGetUserByIdUseCase {
  execute(userId: string): Promise<UserResponseDto>;
}
