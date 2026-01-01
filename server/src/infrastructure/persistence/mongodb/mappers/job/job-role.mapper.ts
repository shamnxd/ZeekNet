import { JobRole } from '../../../../../domain/entities/job-role.entity';
import { JobRoleDocument } from '../../models/job-role.model';

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

