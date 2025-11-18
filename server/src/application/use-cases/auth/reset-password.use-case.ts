import { IPasswordHasher } from '../../../domain/interfaces/services/IPasswordHasher';
import { IPasswordResetService } from '../../../domain/interfaces/services/IPasswordResetService';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IResetPasswordUseCase } from '../../../domain/interfaces/use-cases/IAuthUseCases';
import { ValidationError } from '../../../domain/errors/errors';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _passwordResetService: IPasswordResetService,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const resetData = await this._passwordResetService.getResetToken(token);
    if (!resetData) {
      throw new ValidationError('Invalid or expired reset token');
    }
    const hashedPassword = await this._passwordHasher.hash(newPassword);
    await this._userRepository.update(resetData.userId, { password: hashedPassword });
    await this._passwordResetService.invalidateToken(token);
  }
}