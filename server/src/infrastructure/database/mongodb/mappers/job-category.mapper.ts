import { JobCategory } from '../../../../domain/entities/job-category.entity';
import { Document } from 'mongoose';

export interface JobCategoryDocument extends Document {
  _id: unknown;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JobCategoryMapper {
  static toEntity(doc: JobCategoryDocument): JobCategory {
    return JobCategory.create({
      id: String(doc._id),
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}