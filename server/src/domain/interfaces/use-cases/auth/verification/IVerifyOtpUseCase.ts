import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';


export interface IVerifyOtpUseCase {
  execute(email: string, code: string): Promise<UserResponseDto>;
}

