import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { BadRequestError } from '../../../domain/errors/errors';
import { UserMapper } from '../../mappers/user.mapper';
import { UserResponseDto } from '../../dto/auth/user-response.dto';
import { IGetUserByEmailUseCase } from 'src/domain/interfaces/use-cases/auth/IGetUserByEmailUseCase';

export class GetUserByEmailUseCase implements IGetUserByEmailUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDto | null> {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const user = await this._userRepository.findOne({ email });
    return user ? UserMapper.toResponse(user) : null;
  }
}
