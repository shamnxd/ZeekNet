import { UserResponseDto } from 'src/application/dto/auth/user-response.dto';


export interface IAuthGetUserByIdUseCase {
  execute(userId: string): Promise<UserResponseDto | null>;
}
