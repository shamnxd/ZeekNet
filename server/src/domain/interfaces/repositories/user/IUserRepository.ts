import { User } from '../../../entities/user.entity';
import { IBaseRepository } from '../IBaseRepository';


export interface IUserRepository extends IBaseRepository<User> {
}