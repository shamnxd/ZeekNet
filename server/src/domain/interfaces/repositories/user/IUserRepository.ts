import { User } from '../../../entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';
import { IBaseRepository } from '../IBaseRepository';

// Use base repository methods
export interface IUserRepository extends IBaseRepository<User> {
  // Use findOne({ email }) instead of findByEmail
}