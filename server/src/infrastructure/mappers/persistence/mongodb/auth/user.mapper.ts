import { User } from 'src/domain/entities/user.entity';
import { UserDocument } from 'src/infrastructure/persistence/mongodb/models/user.model';

export class UserMapper {
  static toEntity(doc: UserDocument): User {
    return User.create({
      id: String(doc._id),
      name: doc.name || '',
      email: doc.email,
      password: doc.password,
      role: doc.role,
      isVerified: doc.isVerified,
      isBlocked: doc.isBlocked,
      refreshToken: doc.refreshToken || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: User): Partial<UserDocument> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      isVerified: entity.isVerified,
      isBlocked: entity.isBlocked,
      refreshToken: entity.refreshToken || undefined,
    };
  }
}

