import { LoginResponseDto } from 'src/application/dto/auth/login-response.dto';


export interface ILoginUserUseCase {
  execute(email: string, password: string): Promise<LoginResponseDto>;
}
