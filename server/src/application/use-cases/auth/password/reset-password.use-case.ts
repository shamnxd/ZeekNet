import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IPasswordResetService } from 'src/domain/interfaces/services/IPasswordResetService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IResetPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IResetPasswordUseCase';
import { ValidationError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject(TYPES.PasswordHasher) private readonly _passwordHasher: IPasswordHasher,
    @inject(TYPES.PasswordResetService) private readonly _passwordResetService: IPasswordResetService,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }


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
