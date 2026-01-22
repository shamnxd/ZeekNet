import { GoogleLoginRequestDto } from 'src/application/dtos/auth/session/google-login.dto';
import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';

export interface IGoogleLoginUseCase {
  execute(params: GoogleLoginRequestDto): Promise<LoginResponseDto>;
}

