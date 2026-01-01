import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { BadRequestError } from 'src/domain/errors/errors';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { UserResponseDto } from 'src/application/dtos/auth/verification/responses/user-response.dto';
import { IGetUserByEmailUseCase } from 'src/domain/interfaces/use-cases/auth/user/IGetUserByEmailUseCase';

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


