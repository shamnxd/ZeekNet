import { IJobRoleRepository, JobRoleQueryFilters, PaginatedJobRoles } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { JobRoleModel, JobRoleDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/job-role.model';
import { JobRoleMapper } from 'src/infrastructure/mappers/persistence/mongodb/job/job-role.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class JobRoleRepository extends RepositoryBase<JobRole, ModelDocument> implements IJobRoleRepository {
  constructor() {
    super(JobRoleModel);
  }

  protected mapToEntity(doc: ModelDocument): JobRole {
    return JobRoleMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<JobRole>): Partial<ModelDocument> {
    return JobRoleMapper.toDocument(entity as JobRole);
  }

  async findByName(name: string): Promise<JobRole | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }
}


