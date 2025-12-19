import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IUpdateUserVerificationStatusUseCase } from 'src/domain/interfaces/use-cases/auth/IUpdateUserVerificationStatusUseCase';
import { BadRequestError, NotFoundError } from '../../../domain/errors/errors';

export class UpdateUserVerificationStatusUseCase implements IUpdateUserVerificationStatusUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string, isVerified: boolean): Promise<void> {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    if (typeof isVerified !== 'boolean') {
      throw new BadRequestError('isVerified must be a boolean value');
    }

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    await this._userRepository.update(user.id, { isVerified });
  }
}
