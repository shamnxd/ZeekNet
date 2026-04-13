import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IPasswordResetService } from 'src/domain/interfaces/services/IPasswordResetService';
import { IForgotPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IForgotPasswordUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.PasswordResetService) private readonly _passwordResetService: IPasswordResetService,
  ) { }


  async execute(email: string): Promise<void> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundError(ERROR.NOT_FOUND('Email'));
    }
    const token = await this._passwordResetService.generateResetToken(user.id, user.email);
    await this._passwordResetService.sendResetEmail(user.email, token);
  }
}
