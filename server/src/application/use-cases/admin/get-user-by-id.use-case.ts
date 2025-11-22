import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IAdminGetUserByIdUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { NotFoundError } from '../../../domain/errors/errors';
import { User } from '../../../domain/entities/user.entity';

export class GetUserByIdUseCase implements IAdminGetUserByIdUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
