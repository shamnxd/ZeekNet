import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    await this._userRepository.update(userId, { refreshToken: null });
  }
}
