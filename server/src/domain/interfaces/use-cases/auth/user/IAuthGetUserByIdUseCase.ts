import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';


export interface IAuthGetUserByIdUseCase {
  execute(userId: string): Promise<UserResponseDto | null>;
}

