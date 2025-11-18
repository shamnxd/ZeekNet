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

  // Thin CRUD methods only
  async create(userData: Partial<User>): Promise<User> {
    const document = await this.model.create({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.mapToEntity(document);
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const document = await this.model.findById(id);
    return document ? this.mapToEntity(document) : null;
  }

  async findOne(criteria: Partial<User>): Promise<User | null> {
    const document = await this.model.findOne(criteria);
    return document ? this.mapToEntity(document) : null;
  }

  async findMany(criteria: Partial<User>): Promise<User[]> {
    const documents = await this.model.find(criteria);
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const document = await this.model.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true },
    );
    return document ? this.mapToEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async exists(criteria: Partial<User>): Promise<boolean> {
    const count = await this.model.countDocuments(criteria);
    return count > 0;
  }

  async count(criteria: Partial<User>): Promise<number> {
    return await this.model.countDocuments(criteria);
  }

  // Convenience method (wraps findOne)
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}