export interface IBaseRepository<T> {
  create(entity: Omit<T, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Query methods
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  findMany(filter: Record<string, unknown>): Promise<T[]>;
  exists(filter: Record<string, unknown>): Promise<boolean>;
  countDocuments(filter: Record<string, unknown>): Promise<number>;
  
  // Bulk operations
  deleteMany(filter: Record<string, unknown>): Promise<number>;
  updateMany(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<number>;
}