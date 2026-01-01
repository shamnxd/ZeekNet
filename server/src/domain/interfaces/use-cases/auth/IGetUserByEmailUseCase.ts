import { UserResponseDto } from 'src/application/dtos/auth/responses/user-response.dto';


export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<UserResponseDto | null>;
}

