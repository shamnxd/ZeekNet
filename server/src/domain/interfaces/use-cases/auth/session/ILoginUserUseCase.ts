import { LoginRequestDto } from 'src/application/dtos/auth/session/login.dto';
import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';

export interface ILoginUserUseCase {
  execute(params: LoginRequestDto): Promise<LoginResponseDto>;
}

