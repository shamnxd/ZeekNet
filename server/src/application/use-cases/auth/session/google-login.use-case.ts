import crypto from 'crypto';
import { AuthorizationError } from 'src/domain/errors/errors';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IGoogleTokenVerifier } from 'src/domain/interfaces/services/IGoogleTokenVerifier';
import { IGoogleLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IGoogleLoginUseCase';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';
import { GoogleLoginRequestDto } from 'src/application/dtos/auth/session/google-login.dto';

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _googleVerifier: IGoogleTokenVerifier,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) { }

  async execute(params: GoogleLoginRequestDto): Promise<LoginResponseDto> {
    const { idToken } = params;
    const profile = await this._googleVerifier.verifyIdToken(idToken);
    let user = await this._userRepository.findOne({ email: profile.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await this._passwordHasher.hash(randomPassword);
      user = await this._userRepository.create(
        UserMapper.fromGoogleProfile(profile, hashedPassword),
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


