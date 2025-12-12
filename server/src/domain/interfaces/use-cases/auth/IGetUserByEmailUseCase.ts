import { UserResponseDto } from 'src/application/dto/auth/user-response.dto';


export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<UserResponseDto | null>;
}
