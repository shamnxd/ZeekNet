export type EntityMetadata = {
  id: string;
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateInput<T> = Omit<T, keyof EntityMetadata>;

export type UpdateInput<T> = Partial<Omit<T, keyof EntityMetadata>>;

export type PartialEntity<T> = UpdateInput<T>;

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
