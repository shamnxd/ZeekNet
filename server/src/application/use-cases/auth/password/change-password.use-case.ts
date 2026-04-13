import { IPasswordHasher } from 'src/domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IChangePasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IChangePasswordUseCase';
import { AuthenticationError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.PasswordHasher) private readonly _passwordHasher: IPasswordHasher,
  ) { }


  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError(ERROR.NOT_FOUND('User'));
    }
    const isCurrentValid = await this._passwordHasher.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new AuthenticationError('Current password is incorrect');
    }
    const hashedPassword = await this._passwordHasher.hash(newPassword);
    await this._userRepository.update(userId, { password: hashedPassword });
  }
}
