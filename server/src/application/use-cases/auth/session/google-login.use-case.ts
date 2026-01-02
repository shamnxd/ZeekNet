import { LoginResponseDto } from 'src/application/dtos/auth/session/responses/login-response.dto';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IGoogleTokenVerifier } from 'src/domain/interfaces/services/IGoogleTokenVerifier';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IGoogleLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IGoogleLoginUseCase';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { AuthorizationError } from 'src/domain/errors/errors';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { User } from 'src/domain/entities/user.entity';

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _googleVerifier: IGoogleTokenVerifier,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
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
      const { subject, html } = this._emailTemplateService.getOtpVerificationEmail(code);
      await this._mailerService.sendMail(user.email, subject, html);
      return { user: UserMapper.toResponse(user) };
    }

    const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);
    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });
    return { tokens: { accessToken, refreshToken }, user: UserMapper.toResponse(user) };
  }
}


