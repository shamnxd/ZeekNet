import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly isVerified: boolean,
    public readonly isBlocked: boolean,
    public readonly refreshToken: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: { id: string; name: string; email: string; password: string; role?: UserRole; isVerified?: boolean; isBlocked?: boolean; refreshToken?: string | null; createdAt?: Date; updatedAt?: Date }): User {
    const now = new Date();
    return new User(data.id, data.name, data.email, data.password, data.role ?? UserRole.SEEKER, data.isVerified ?? false, data.isBlocked ?? false, data.refreshToken ?? null, data.createdAt ?? now, data.updatedAt ?? now);
  }

}
