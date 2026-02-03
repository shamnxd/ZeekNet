import { UserRole } from 'src/domain/enums/user-role.enum';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { AuthenticationError, AuthorizationError } from 'src/domain/errors/errors';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { ILoginUserUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILoginUserUseCase';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { LoginRequestDto } from 'src/application/dtos/auth/session/login.dto';
import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) { }

  async execute(params: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = params;
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
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


