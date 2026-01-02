import { LoginResponseDto } from 'src/application/dtos/auth/session/responses/login-response.dto';


export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<LoginResponseDto>;
}

