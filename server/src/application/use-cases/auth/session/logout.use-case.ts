import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(@inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository) { }


  async execute(userId: string): Promise<void> {
    await this._userRepository.update(userId, { refreshToken: null });
  }
}
