import { RegisterResult, LoginResult } from '../../../application/dto/auth/auth-response.dto';
import { UserResponseDto } from '../../../application/dto/auth/user-response.dto';
import { User } from '../../entities/user.entity';
import { CompanyProfile } from '../../entities/company-profile.entity';

export interface IRegisterUserUseCase {
  execute(email: string, password: string, role?: unknown, name?: string): Promise<RegisterResult>;
}

export interface ILoginUserUseCase {
  execute(email: string, password: string): Promise<LoginResult>;
}

export interface IAdminLoginUseCase {
  execute(email: string, password: string): Promise<LoginResult>;
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
  execute(email: string, isVerified: boolean): Promise<void>;
}

export interface IUpdateUserRefreshTokenUseCase {
  execute(userId: string, hashedRefreshToken: string): Promise<void>;
}