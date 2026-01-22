import { ValidationError } from 'src/domain/errors/errors';
import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { IRegisterUserUseCase } from 'src/domain/interfaces/use-cases/auth/registration/IRegisterUserUseCase';

import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { RegisterResponseDto } from 'src/application/dtos/auth/registration/register-response.dto';
import { RegisterRequestDto } from 'src/application/dtos/auth/registration/register.dto';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) { }

  async execute(params: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, password } = params;

    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await this._passwordHasher.hash(password);

    const user = await this._userRepository.create(
      UserMapper.fromRegistration(params, hashedPassword)
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


