import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ILogoutUseCase } from '../../../domain/interfaces/use-cases/auth/IAuthUseCases';

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    await this._userRepository.update(userId, { refreshToken: null });
  }
}
