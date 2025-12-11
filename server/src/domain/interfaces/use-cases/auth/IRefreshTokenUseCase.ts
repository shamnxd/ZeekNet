import { LoginResponseDto } from 'src/application/dto/auth/login-response.dto';


export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<LoginResponseDto>;
}
