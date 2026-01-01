import { IOtpService } from '../../../domain/interfaces/services/IOtpService';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IVerifyOtpUseCase } from 'src/domain/interfaces/use-cases/auth/IVerifyOtpUseCase';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { UserMapper } from '../../mappers/auth/user.mapper';
import { UserResponseDto } from '../../dtos/auth/responses/user-response.dto';

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(email: string, code: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const isValid = await this._otpService.verifyOtp(email, code);
    if (!isValid) {
      throw new ValidationError('Invalid or expired OTP code');
    }

    await this._userRepository.update(user.id, { isVerified: true });

    const updatedUser = await this._userRepository.findOne({ email });
    if (!updatedUser) {
      throw new NotFoundError('User not found after verification');
    }
    return UserMapper.toResponse(updatedUser);
  }
}


