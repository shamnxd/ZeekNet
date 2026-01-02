import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { BcryptPasswordHasher } from 'src/infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from 'src/infrastructure/security/jwt-token-service';
import { GoogleAuthTokenVerifier } from 'src/infrastructure/security/google-token-verifier';
import { PasswordResetServiceImpl } from 'src/infrastructure/security/password-reset-service';
import { RedisOtpService } from 'src/infrastructure/persistence/redis/services/redis-otp-service';
import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { RegisterUserUseCase } from 'src/application/use-cases/auth/registration/register-user.use-case';
import { LoginUserUseCase } from 'src/application/use-cases/auth/session/login-user.use-case';
import { AdminLoginUseCase } from 'src/application/use-cases/auth/session/admin-login.use-case';
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/password/forgot-password.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/password/reset-password.use-case';
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/verification/verify-otp.use-case';
import { GoogleLoginUseCase } from 'src/application/use-cases/auth/session/google-login.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/session/refresh-token.use-case';
import { LogoutUseCase } from 'src/application/use-cases/auth/session/logout.use-case';
import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from 'src/application/use-cases/auth/user/get-user-by-email.use-case';
import { UpdateUserVerificationStatusUseCase } from 'src/application/use-cases/auth/verification/update-user-verification-status.use-case';
import { UpdateUserRefreshTokenUseCase } from 'src/application/use-cases/auth/session/update-user-refresh-token.use-case';
import { GetCompanyProfileByUserIdUseCase } from 'src/application/use-cases/company/profile/info/get-company-profile-by-user-id.use-case';
import { RegistrationController } from 'src/presentation/controllers/auth/registration.controller';
import { LoginController } from 'src/presentation/controllers/auth/login.controller';
import { TokenController } from 'src/presentation/controllers/auth/token.controller';
import { PasswordController } from 'src/presentation/controllers/auth/password.controller';
import { OtpController } from 'src/presentation/controllers/auth/otp.controller';
import { CookieService } from 'src/infrastructure/services/cookie.service';
import { EmailTemplateService } from 'src/infrastructure/services/email-template.service';

import { logger } from 'src/infrastructure/config/logger';

logger.info('Initializing authDi...');
const userRepository = new UserRepository();
const companyProfileRepository = new CompanyProfileRepository();
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

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, passwordResetService);

const resetPasswordUseCase = new ResetPasswordUseCase(passwordHasher, passwordResetService, userRepository);

const verifyOtpUseCase = new VerifyOtpUseCase(otpService, userRepository);

const googleLoginUseCase = new GoogleLoginUseCase(userRepository, passwordHasher, tokenService, googleTokenVerifier, otpService, mailerService, emailTemplateService);

const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenService, passwordHasher);

const logoutUseCase = new LogoutUseCase(userRepository);

const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

const updateUserVerificationStatusUseCase = new UpdateUserVerificationStatusUseCase(userRepository);

const updateUserRefreshTokenUseCase = new UpdateUserRefreshTokenUseCase(userRepository);

const getCompanyProfileByUserIdUseCase = new GetCompanyProfileByUserIdUseCase(companyProfileRepository);

export const registrationController = new RegistrationController(registerUserUseCase);

export const loginController = new LoginController(loginUserUseCase, adminLoginUseCase, googleLoginUseCase, cookieService);

export const tokenController = new TokenController(refreshTokenUseCase, getUserByIdUseCase, tokenService, cookieService);

export const passwordController = new PasswordController(forgotPasswordUseCase, resetPasswordUseCase, logoutUseCase, cookieService);

export const otpController = new OtpController(otpService, mailerService, getUserByEmailUseCase, updateUserVerificationStatusUseCase, updateUserRefreshTokenUseCase, tokenService, passwordHasher, cookieService);

export { userRepository };
logger.info('authDi initialization complete');

