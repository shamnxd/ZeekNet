import { RegisterResult } from '../../dto/auth/auth-response.dto';
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

  async execute(email: string, password: string, role?: UserRole, name?: string): Promise<RegisterResult> {
    const validationResult = this.validateInput(email, password, name);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors.join(', '));
    }

    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await this._passwordHasher.hash(password);

    const user = await this._userRepository.create({
      name: name ?? '',
      email,
      password: hashedPassword,
      role: role ?? UserRole.SEEKER,
      isVerified: false,
      isBlocked: false,
      refreshToken: null,
    } as Omit<User, 'id' | '_id' | 'createdAt' | 'updatedAt'>);

    await this.sendOtpEmail(user.email);

    return { user: UserMapper.toResponse(user) };
  }

  private validateInput(
    email: string,
    password: string,
    name?: string,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!email || !this.isValidEmail(email)) {
      errors.push('Valid email address is required');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (name && (name.trim().length < 2 || name.trim().length > 50)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async sendOtpEmail(email: string): Promise<void> {
    const code = await this._otpService.generateAndStoreOtp(email);
    const htmlContent = otpVerificationTemplate.html(code);
    await this._mailerService.sendMail(email, otpVerificationTemplate.subject, htmlContent);
  }
}
