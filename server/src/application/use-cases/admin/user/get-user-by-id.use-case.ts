import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IAdminGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/admin/user/IAdminGetUserByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { User } from 'src/domain/entities/user.entity';

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
