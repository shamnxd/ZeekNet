import { LoginResponseDto } from 'src/application/dto/auth/login-response.dto';


export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<LoginResponseDto>;
}
