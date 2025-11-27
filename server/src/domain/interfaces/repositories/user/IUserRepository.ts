import { User } from '../../../entities/user.entity';
import { IBaseRepository } from '../IBaseRepository';

// Use base repository methods
export interface IUserRepository extends IBaseRepository<User> {
}