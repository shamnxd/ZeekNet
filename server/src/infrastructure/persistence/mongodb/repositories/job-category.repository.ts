import { IJobCategoryRepository, JobCategoryQueryFilters, PaginatedJobCategories } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { JobCategoryModel, JobCategoryDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/job-category.model';
import { JobCategoryMapper } from 'src/infrastructure/mappers/persistence/mongodb/job/job-category.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class JobCategoryRepository extends RepositoryBase<JobCategory, ModelDocument> implements IJobCategoryRepository {
  constructor() {
    super(JobCategoryModel);
  }

  protected mapToEntity(doc: ModelDocument): JobCategory {
    return JobCategoryMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<JobCategory>): Partial<ModelDocument> {
    return JobCategoryMapper.toDocument(entity as JobCategory);
  }

  async findByName(name: string): Promise<JobCategory | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }
}

