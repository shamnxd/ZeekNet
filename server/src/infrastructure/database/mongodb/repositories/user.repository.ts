import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel, UserDocument } from '../models/user.model';
import { UserMapper } from '../mappers/user.mapper';
import { Types } from 'mongoose';
import { RepositoryBase } from './base-repository';

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
}