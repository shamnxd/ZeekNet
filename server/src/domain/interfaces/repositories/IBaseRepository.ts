export interface IBaseRepository<T> {
  create(entity: Omit<T, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  // Query methods
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  findMany(filter: Record<string, unknown>): Promise<T[]>;
  countDocuments(filter: Record<string, unknown>): Promise<number>;
}