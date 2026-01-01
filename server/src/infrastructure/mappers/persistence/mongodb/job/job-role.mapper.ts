import { JobRole } from 'src/domain/entities/job-role.entity';
import { JobRoleDocument } from 'src/infrastructure/persistence/mongodb/models/job-role.model';

export class JobRoleMapper {
  static toEntity(doc: JobRoleDocument): JobRole {
    return JobRole.create({
      id: String(doc._id),
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: JobRole): Partial<JobRoleDocument> {
    return {
      name: entity.name,
    };
  }
}

