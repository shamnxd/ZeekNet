import { LoginResponseDto } from 'src/application/dtos/auth/session/responses/login-response.dto';


export interface ILoginUserUseCase {
  execute(email: string, password: string): Promise<LoginResponseDto>;
}

