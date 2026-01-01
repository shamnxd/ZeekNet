import { User } from 'src/domain/entities/user.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
  findByIds(ids: string[]): Promise<User[]>;
}
