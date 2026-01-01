import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IPasswordResetService } from 'src/domain/interfaces/services/IPasswordResetService';
import { NotFoundError } from 'src/domain/errors/errors';

export class ForgotPasswordUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordResetService: IPasswordResetService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundError('Email not found');
    }
    const token = await this._passwordResetService.generateResetToken(user.id, user.email);
    await this._passwordResetService.sendResetEmail(user.email, token);
  }
}
