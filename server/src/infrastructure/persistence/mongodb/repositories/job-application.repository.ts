import { Types } from 'mongoose';
import type { IJobApplicationRepository, PaginatedApplications } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import type { JobApplication } from 'src/domain/entities/job-application.entity';
import { JobApplicationModel } from 'src/infrastructure/persistence/mongodb/models/job-application.model';
import { JobApplicationMapper } from 'src/infrastructure/mappers/persistence/mongodb/job-application/job-application.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import type { JobApplicationDocument } from 'src/infrastructure/persistence/mongodb/models/job-application.model';

export class JobApplicationRepository extends RepositoryBase<JobApplication, JobApplicationDocument> implements IJobApplicationRepository {
  constructor() {
    super(JobApplicationModel);
  }

  protected mapToEntity(doc: JobApplicationDocument): JobApplication {
    return JobApplicationMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<JobApplication>): Partial<JobApplicationDocument> {
    return JobApplicationMapper.toDocument(entity as JobApplication);
  }

  async findByJobId(jobId: string): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({ job_id: new Types.ObjectId(jobId) }).sort({ createdAt: -1 });
    return docs.map(JobApplicationMapper.toEntity);
  }

  
  
}

