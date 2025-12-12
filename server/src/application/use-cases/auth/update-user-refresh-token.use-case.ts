import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IUpdateUserRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/IUpdateUserRefreshTokenUseCase';
import { AppError } from '../../../domain/errors/errors';

export class UpdateUserRefreshTokenUseCase implements IUpdateUserRefreshTokenUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string, hashedRefreshToken: string): Promise<void> {
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    if (!hashedRefreshToken) {
      throw new AppError('Hashed refresh token is required', 400);
    }

    await this._userRepository.update(userId, { refreshToken: hashedRefreshToken });
  }
}
