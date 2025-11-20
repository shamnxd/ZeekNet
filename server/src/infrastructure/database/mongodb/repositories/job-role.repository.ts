import { IJobRoleRepository, JobRoleQueryFilters, PaginatedJobRoles } from '../../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from '../../../../domain/entities/job-role.entity';
import { JobRoleModel, JobRoleDocument as ModelDocument } from '../models/job-role.model';
import { JobRoleMapper } from '../mappers/job-role.mapper';
import { RepositoryBase } from './base-repository';

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

  // Keep findByName - it has special regex logic for case-insensitive exact match
  async findByName(name: string): Promise<JobRole | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAllWithPagination(filters?: JobRoleQueryFilters): Promise<PaginatedJobRoles> {
    return await this.paginate<PaginatedJobRoles>({
      page: filters?.page,
      limit: filters?.limit,
      search: filters?.search,
      searchField: 'name',
      sortBy: filters?.sortBy || 'name',
      sortOrder: filters?.sortOrder || 'asc',
      resultKey: 'jobRoles',
    });
  }
}

