import { User } from '../../../entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';

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

// Thin CRUD repository interface
export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findOne(criteria: Partial<User>): Promise<User | null>;
  findMany(criteria: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  exists(criteria: Partial<User>): Promise<boolean>;
  count(criteria: Partial<User>): Promise<number>;
  
  // Convenience method (wraps findOne)
  findByEmail(email: string): Promise<User | null>;
}