import { RegisterResult, LoginResult } from '../../../../application/dto/auth/auth-response.dto';
import { UserResponseDto } from '../../../../application/dto/auth/user-response.dto';
import { User } from '../../../entities/user.entity';
import { CompanyProfile } from '../../../entities/company-profile.entity';
import { RegisterRequestDto } from '../../../../application/dto/auth/register.dto';
import { LoginRequestDto } from '../../../../application/dto/auth/login.dto';
import { UpdateUserVerificationStatusRequestDto } from '../../../../application/dto/auth/update-user-verification-status.dto';
import { UpdateUserRefreshTokenRequestDto } from '../../../../application/dto/auth/update-user-refresh-token.dto';

export interface IRegisterUserUseCase {
  execute(data: RegisterRequestDto): Promise<RegisterResult>;
}

export interface ILoginUserUseCase {
  execute(data: LoginRequestDto): Promise<LoginResult>;
}

export interface IAdminLoginUseCase {
  execute(data: LoginRequestDto): Promise<LoginResult>;
}

export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<LoginResult>;
}

export interface IForgotPasswordUseCase {
  execute(email: string): Promise<void>;
}

export interface IResetPasswordUseCase {
  execute(token: string, newPassword: string): Promise<void>;
}

export interface IVerifyOtpUseCase {
  execute(email: string, code: string): Promise<UserResponseDto>;
}

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<LoginResult>;
}

export interface ILogoutUseCase {
  execute(userId: string): Promise<void>;
}

export interface IAuthGetUserByIdUseCase {
  execute(userId: string): Promise<UserResponseDto | null>;
}

export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<UserResponseDto | null>;
}

export interface IUpdateUserVerificationStatusUseCase {
  execute(data: UpdateUserVerificationStatusRequestDto): Promise<void>;
}

export interface IUpdateUserRefreshTokenUseCase {
  execute(data: UpdateUserRefreshTokenRequestDto): Promise<void>;
}