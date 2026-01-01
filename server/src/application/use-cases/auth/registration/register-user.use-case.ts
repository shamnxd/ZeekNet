import { RegisterResponseDto } from 'src/application/dtos/auth/registration/responses/register-response.dto';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';
import { ValidationError } from 'src/domain/errors/errors';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { User } from 'src/domain/entities/user.entity';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
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
    const { subject, html } = this._emailTemplateService.getOtpVerificationEmail(code);
    await this._mailerService.sendMail(email, subject, html);
  }
}


