import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';

export interface LoginResponseDto {
  tokens?: AuthTokens;
  user: UserResponseDto;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

