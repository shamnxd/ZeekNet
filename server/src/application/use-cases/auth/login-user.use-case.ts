import { LoginResult } from '../../dto/auth/auth-response.dto';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { IOtpService } from '../../../domain/interfaces/services/IOtpService';
import { IMailerService } from '../../../domain/interfaces/services/IMailerService';
import { ILoginUserUseCase } from '../../../domain/interfaces/use-cases/auth/IAuthUseCases';
import { AuthenticationError, AuthorizationError } from '../../../domain/errors/errors';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserMapper } from '../../mappers/user.mapper';
import { otpVerificationTemplate } from '../../../infrastructure/messaging/templates/otp-verification.template';

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new AuthorizationError('User is blocked. Contact support for assistance.');
    }

    if (!user.isVerified) {
      const code = await this._otpService.generateAndStoreOtp(user.email);
      const htmlContent = otpVerificationTemplate.html(code);
      await this._mailerService.sendMail(user.email, otpVerificationTemplate.subject, htmlContent);
      return { user: UserMapper.toResponse(user) };
    }

    if (user.role === UserRole.ADMIN) {
      throw new AuthenticationError('Please use admin login endpoint');
    }

    const isPasswordValid = await this._passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);

    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });

    return {
      tokens: { accessToken, refreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}
