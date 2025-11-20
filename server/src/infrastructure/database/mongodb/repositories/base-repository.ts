import { Model, Document as MongooseDocument, FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { IBaseRepository } from '../../../../domain/interfaces/repositories/IBaseRepository';

export abstract class RepositoryBase<T, TDocument extends MongooseDocument> {
  constructor(protected model: Model<TDocument>) {}

  protected convertToObjectIds(data: Record<string, unknown>): Record<string, unknown> {
    const converted = { ...data };

    for (const key in converted) {
      if (key.endsWith('Id') || key === 'companyId') {
        const value = converted[key];
        if (typeof value === 'string' && value.length === 24 && /^[0-9a-fA-F]{24}$/.test(value)) {
          
          converted[key] = this.toObjectId(value);
        }
      }
    }
    
    return converted;
  }

  async create(data: Omit<T, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const convertedData = this.convertToObjectIds(data as Record<string, unknown>);
    
    const document = new this.model({
      ...convertedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedDocument = await document.save();
    return this.mapToEntity(savedDocument);
  }

  async findById(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.model.findById(id);
    return document ? this.mapToEntity(document) : null;
  }

  async findAll(): Promise<T[]> {
    const documents = await this.model.find();
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
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

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  async findOne(filter: FilterQuery<TDocument> | Record<string, unknown>): Promise<T | null> {
    const document = await this.model.findOne(filter as FilterQuery<TDocument>);
    return document ? this.mapToEntity(document) : null;
  }

  async findMany(filter: FilterQuery<TDocument> | Record<string, unknown>): Promise<T[]> {
    const documents = await this.model.find(filter as FilterQuery<TDocument>);
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async countDocuments(filter: FilterQuery<TDocument> | Record<string, unknown>): Promise<number> {
    return await this.model.countDocuments(filter as FilterQuery<TDocument>);
  }

  async deleteMany(filter: FilterQuery<TDocument> | Record<string, unknown>): Promise<number> {
    const result = await this.model.deleteMany(filter as FilterQuery<TDocument>);
    return result.deletedCount || 0;
  }

  async updateMany(filter: FilterQuery<TDocument> | Record<string, unknown>, update: Record<string, unknown>): Promise<number> {
    const result = await this.model.updateMany(filter as FilterQuery<TDocument>, update);
    return result.modifiedCount || 0;
  }

  
  protected async paginate<R>(
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      searchField?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      resultKey?: string;
    },
  ): Promise<R> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const search = options?.search || '';
    const searchField = options?.searchField || 'name';
    const sortBy = options?.sortBy || 'name';
    const sortOrder = options?.sortOrder === 'desc' ? -1 : 1;
    const resultKey = options?.resultKey || 'items';

    const query: Record<string, unknown> = {};
    if (search) {
      query[searchField] = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const documents = await this.model
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.model.countDocuments(query);
    const items = documents.map((doc) => this.mapToEntity(doc));

    return {
      [resultKey]: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    } as unknown as R;
  }

  async exists(filter: FilterQuery<TDocument> | Record<string, unknown>): Promise<boolean> {
    const count = await this.model.countDocuments(filter as FilterQuery<TDocument>);
    return count > 0;
  }

  protected toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  protected abstract mapToEntity(document: TDocument): T;
}