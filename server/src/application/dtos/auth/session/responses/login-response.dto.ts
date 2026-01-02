import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';

export interface LoginResponseDto {
  tokens?: AuthTokens;
  user: UserResponseDto;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

