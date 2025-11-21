import { Model, Document as MongooseDocument, FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

export abstract class RepositoryBase<T, TDocument extends MongooseDocument> {
  constructor(protected model: Model<TDocument>) {}

  async create(data: Omit<T, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const documentData = this.mapToDocument(data as Partial<T>);
    
    const document = new this.model({
      ...documentData,
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

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const documentData = this.mapToDocument(data);

    const document = await this.model.findByIdAndUpdate(
      id,
      { ...documentData, updatedAt: new Date() },
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

  protected abstract mapToEntity(document: TDocument): T;
  protected abstract mapToDocument(entity: Partial<T>): Partial<TDocument>;
}