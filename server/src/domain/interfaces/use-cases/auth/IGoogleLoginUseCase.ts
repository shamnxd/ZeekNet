import { LoginResult } from 'src/application/dto/auth/auth-response.dto';


export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<LoginResult>;
}
