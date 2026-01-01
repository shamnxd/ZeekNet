import { UserResponseDto } from './user-response.dto';

export interface LoginResponseDto {
  tokens?: AuthTokens;
  user: UserResponseDto;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

