import { User } from 'src/domain/entities/user.entity';

export interface IAdminGetUserByIdUseCase {
  execute(userId: string): Promise<User>;
}
