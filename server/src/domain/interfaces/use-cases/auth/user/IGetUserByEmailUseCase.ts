import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';


export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<UserResponseDto | null>;
}

