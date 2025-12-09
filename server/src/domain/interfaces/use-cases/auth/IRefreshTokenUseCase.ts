import { LoginResult } from 'src/application/dto/auth/auth-response.dto';


export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<LoginResult>;
}
