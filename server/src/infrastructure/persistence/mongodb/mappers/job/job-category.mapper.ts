import { JobCategory } from '../../../../../domain/entities/job-category.entity';
import { JobCategoryDocument } from '../../models/job-category.model';

export class JobCategoryMapper {
  static toEntity(doc: JobCategoryDocument): JobCategory {
    return JobCategory.create({
      id: String(doc._id),
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: JobCategory): Partial<JobCategoryDocument> {
    return {
      name: entity.name,
    };
  }
}

