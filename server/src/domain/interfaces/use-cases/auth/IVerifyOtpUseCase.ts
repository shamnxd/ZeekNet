import { UserResponseDto } from 'src/application/dto/auth/user-response.dto';


export interface IVerifyOtpUseCase {
  execute(email: string, code: string): Promise<UserResponseDto>;
}
