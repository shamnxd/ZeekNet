import { LoginResponseDto } from 'src/application/dtos/auth/session/responses/login-response.dto';


export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<LoginResponseDto>;
}

