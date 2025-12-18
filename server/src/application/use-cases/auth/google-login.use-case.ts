import { LoginResponseDto } from '../../dto/auth/login-response.dto';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { IGoogleTokenVerifier } from '../../../domain/interfaces/services/IGoogleTokenVerifier';
import { IOtpService } from '../../../domain/interfaces/services/IOtpService';
import { IMailerService } from '../../../domain/interfaces/services/IMailerService';
import { IGoogleLoginUseCase } from 'src/domain/interfaces/use-cases/auth/IGoogleLoginUseCase';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { AuthorizationError } from '../../../domain/errors/errors';
import { otpVerificationTemplate } from '../../../infrastructure/messaging/templates/otp-verification.template';
import { UserMapper } from '../../mappers/user.mapper';
import { User } from '../../../domain/entities/user.entity';

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _googleVerifier: IGoogleTokenVerifier,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
  ) {}

  async execute(idToken: string): Promise<LoginResponseDto> {
    const profile = await this._googleVerifier.verifyIdToken(idToken);
    let user = await this._userRepository.findOne({ email: profile.email });

    if (!user) {
      user = await this._userRepository.create(
        UserMapper.toEntity({
          name: profile.name,
          email: profile.email,
          password: await this._passwordHasher.hash('oauth-google'),
          role: UserRole.SEEKER,
          isVerified: profile.emailVerified,
          isBlocked: false,
          refreshToken: undefined,
        }),
      );
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

    const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);
    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });
    return { tokens: { accessToken, refreshToken }, user: UserMapper.toResponse(user) };
  }
}
