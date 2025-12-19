import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IUpdateUserRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/IUpdateUserRefreshTokenUseCase';
import { BadRequestError } from '../../../domain/errors/errors';

export class UpdateUserRefreshTokenUseCase implements IUpdateUserRefreshTokenUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string, hashedRefreshToken: string): Promise<void> {
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    if (!hashedRefreshToken) {
      throw new BadRequestError('Hashed refresh token is required');
    }

    await this._userRepository.update(userId, { refreshToken: hashedRefreshToken });
  }
}
