import { LoginResult } from 'src/application/dto/auth/auth-response.dto';


export interface IAdminLoginUseCase {
  execute(email: string, password: string): Promise<LoginResult>;
}
