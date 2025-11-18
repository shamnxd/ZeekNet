import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ILogoutUseCase } from '../../../domain/interfaces/use-cases/IAuthUseCases';

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    // Use thin repository update method
    await this._userRepository.update(userId, { refreshToken: null });
  }
}