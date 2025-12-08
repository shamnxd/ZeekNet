import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { AppError } from '../../../domain/errors/errors';
import { UserMapper } from '../../mappers/user.mapper';
import { UserResponseDto } from '../../dto/auth/user-response.dto';
import { IGetUserByEmailUseCase } from 'src/domain/interfaces/use-cases/IAuthUseCases';

export class GetUserByEmailUseCase implements IGetUserByEmailUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDto | null> {
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await this._userRepository.findOne({ email });
    return user ? UserMapper.toResponse(user) : null;
  }
}
