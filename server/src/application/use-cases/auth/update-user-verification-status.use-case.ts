import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IUpdateUserVerificationStatusUseCase } from '../../../domain/interfaces/use-cases/IAuthUseCases';
import { AppError } from '../../../domain/errors/errors';

export class UpdateUserVerificationStatusUseCase implements IUpdateUserVerificationStatusUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string, isVerified: boolean): Promise<void> {
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    if (typeof isVerified !== 'boolean') {
      throw new AppError('isVerified must be a boolean value', 400);
    }

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    await this._userRepository.update(user.id, { isVerified });
  }
}
