import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/IAuthGetUserByIdUseCase';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/auth/user.mapper';
import { UserResponseDto } from '../../dtos/auth/responses/user-response.dto';

export class GetUserByIdUseCase implements IAuthGetUserByIdUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findById(userId);
    return user ? UserMapper.toResponse(user) : null;
  }
}


