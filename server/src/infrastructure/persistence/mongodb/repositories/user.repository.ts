import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { User } from 'src/domain/entities/user.entity';
import { UserModel, UserDocument } from 'src/infrastructure/persistence/mongodb/models/user.model';
import { UserMapper } from 'src/infrastructure/mappers/persistence/mongodb/auth/user.mapper';
import { Types } from 'mongoose';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class UserRepository extends RepositoryBase<User, UserDocument> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  protected mapToEntity(document: UserDocument): User {
    return UserMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<User>): Partial<UserDocument> {
    return UserMapper.toDocument(entity as User);
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const validIds = ids.filter(id => Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return [];
    }

    const documents = await UserModel.find({
      _id: { $in: validIds.map(id => new Types.ObjectId(id)) },
    });

    return documents.map(doc => this.mapToEntity(doc));
  }
}

