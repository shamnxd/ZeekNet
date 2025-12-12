import { LoginResponseDto } from 'src/application/dto/auth/login-response.dto';


export interface IAdminLoginUseCase {
  execute(email: string, password: string): Promise<LoginResponseDto>;
}
