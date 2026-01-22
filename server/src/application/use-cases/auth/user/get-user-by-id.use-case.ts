import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/user/IAuthGetUserByIdUseCase';
import { UserMapper } from 'src/application/mappers/auth/user.mapper';
import { UserResponseDto } from 'src/application/dtos/auth/user/user-response.dto';

export class GetUserByIdUseCase implements IAuthGetUserByIdUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findById(userId);
    return user ? UserMapper.toResponse(user) : null;
  }
}


