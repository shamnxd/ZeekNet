import { User } from '../../../entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';
import { IBaseRepository } from '../IBaseRepository';

export interface IUserData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  refreshToken: string | null;
}

// Use base repository methods
export interface IUserRepository extends IBaseRepository<User> {
  // Use findOne({ email }) instead of findByEmail
}