import { UserRole } from 'src/domain/enums/user-role.enum';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IVerifyOtpUseCase } from 'src/domain/interfaces/use-cases/auth/verification/IVerifyOtpUseCase';
import { ValidationError } from 'src/domain/errors/errors';
import { welcomeTemplate } from 'src/infrastructure/messaging/templates/welcome.template';
import { getDashboardLink } from 'src/shared/utils/application/dashboard.utils';
import { VerifyOtpRequestDto } from 'src/application/dtos/auth/verification/verify-otp.dto';
import { LoginResponseDto } from 'src/application/dtos/auth/session/login-response.dto';

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _mailerService: IMailerService,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(params: VerifyOtpRequestDto): Promise<LoginResponseDto> {
    const { email, code } = params;

    const isValid = await this._otpService.verifyOtp(email, code);
    if (!isValid) {
      throw new ValidationError('Invalid or expired OTP');
    }

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new ValidationError('User not found');
    }

    await this._userRepository.update(user.id, { isVerified: true });

    const accessToken = this._tokenService.signAccess({
      sub: user.id,
      role: user.role as UserRole
    });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);

    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });

    const dashboardLink = getDashboardLink(user.role);
    await this._mailerService.sendMail(
      user.email,
      welcomeTemplate.subject,
      welcomeTemplate.html(user.name || 'User', dashboardLink)
    );

    return {
      tokens: { accessToken, refreshToken },
      user,
    };
  }
}