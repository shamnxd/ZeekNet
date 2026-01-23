import { GoogleLoginUseCase } from 'src/application/use-cases/auth/session/google-login.use-case';
import { LoginUserUseCase } from 'src/application/use-cases/auth/session/login-user.use-case';
import { AdminLoginUseCase } from 'src/application/use-cases/auth/session/admin-login.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/session/refresh-token.use-case';
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/password/forgot-password.use-case';
import { LogoutUseCase } from 'src/application/use-cases/auth/session/logout.use-case';

import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/verification/verify-otp.use-case';
import { RequestOtpUseCase } from 'src/application/use-cases/auth/verification/request-otp.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/password/reset-password.use-case';
import { RegisterUserUseCase } from 'src/application/use-cases/auth/registration/register-user.use-case';

import { RedisOtpService } from 'src/infrastructure/persistence/redis/services/redis-otp-service';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';

import { JwtTokenService } from 'src/infrastructure/security/jwt-token-service';
import { BcryptPasswordHasher } from 'src/infrastructure/security/bcrypt-password-hasher';
import { GoogleAuthTokenVerifier } from 'src/infrastructure/security/google-token-verifier';
import { PasswordResetServiceImpl } from 'src/infrastructure/security/password-reset-service';

import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { CookieService } from 'src/infrastructure/http/cookie.service';
import { EmailTemplateService } from 'src/infrastructure/messaging/email-template.service';

import { OtpController } from 'src/presentation/controllers/auth/otp.controller';
import { LoginController } from 'src/presentation/controllers/auth/login.controller';
import { TokenController } from 'src/presentation/controllers/auth/token.controller';
import { PasswordController } from 'src/presentation/controllers/auth/password.controller';
import { RegistrationController } from 'src/presentation/controllers/auth/registration.controller';

import { logger } from 'src/infrastructure/config/logger';

logger.info('Initializing authDi...');
const userRepository = new UserRepository();

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const googleTokenVerifier = new GoogleAuthTokenVerifier();
const otpService = new RedisOtpService();
const mailerService = new NodemailerService();
const passwordResetService = new PasswordResetServiceImpl(mailerService);
const cookieService = new CookieService();
const emailTemplateService = new EmailTemplateService();

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher, otpService, mailerService, emailTemplateService);

const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService, otpService, mailerService, emailTemplateService);
const adminLoginUseCase = new AdminLoginUseCase(userRepository, passwordHasher, tokenService);
const googleLoginUseCase = new GoogleLoginUseCase(userRepository, passwordHasher, tokenService, googleTokenVerifier, otpService, mailerService, emailTemplateService);

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, passwordResetService);
const resetPasswordUseCase = new ResetPasswordUseCase(passwordHasher, passwordResetService, userRepository);

const verifyOtpUseCase = new VerifyOtpUseCase(otpService, tokenService, passwordHasher, mailerService, userRepository);
const requestOtpUseCase = new RequestOtpUseCase(otpService, mailerService, userRepository);

const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenService, passwordHasher);
const logoutUseCase = new LogoutUseCase(userRepository);

const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

export const registrationController = new RegistrationController(registerUserUseCase);
export const loginController = new LoginController(loginUserUseCase, adminLoginUseCase, googleLoginUseCase, cookieService);
export const tokenController = new TokenController(refreshTokenUseCase, getUserByIdUseCase, tokenService, cookieService);
export const passwordController = new PasswordController(forgotPasswordUseCase, resetPasswordUseCase, logoutUseCase, cookieService);
export const otpController = new OtpController(requestOtpUseCase, verifyOtpUseCase, cookieService);
export { userRepository };

logger.info('authDi initialization complete');






