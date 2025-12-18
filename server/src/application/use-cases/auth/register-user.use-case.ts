import { RegisterResponseDto } from '../../dto/auth/register-response.dto';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { IOtpService } from '../../../domain/interfaces/services/IOtpService';
import { IMailerService } from '../../../domain/interfaces/services/IMailerService';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/IRegisterUserUseCase';
import { ValidationError } from '../../../domain/errors/errors';
import { otpVerificationTemplate } from '../../../infrastructure/messaging/templates/otp-verification.template';
import { UserMapper } from '../../mappers/user.mapper';
import { User } from '../../../domain/entities/user.entity';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
  ) {}

  async execute(email: string, password: string, role?: UserRole, name?: string): Promise<RegisterResponseDto> {
    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await this._passwordHasher.hash(password);

    const user = await this._userRepository.create(
      UserMapper.toEntity({
        name: name || '',
        email,
        password: hashedPassword,
        role: role as UserRole || UserRole.SEEKER,
        isVerified: false,
        isBlocked: false,
      }),
    );

    await this.sendOtpEmail(user.email);

    return { user: UserMapper.toResponse(user) };
  }

  private async sendOtpEmail(email: string): Promise<void> {
    const code = await this._otpService.generateAndStoreOtp(email);
    const htmlContent = otpVerificationTemplate.html(code);
    await this._mailerService.sendMail(email, otpVerificationTemplate.subject, htmlContent);
  }
}
