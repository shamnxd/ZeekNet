import { Types } from 'mongoose';
import type { IJobApplicationRepository, PaginatedApplications } from '../../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import type { JobApplication } from '../../../../domain/entities/job-application.entity';
import { JobApplicationModel } from '../models/job-application.model';
import { JobApplicationMapper } from '../mappers/job-application/job-application.mapper';
import { RepositoryBase } from './base-repository';
import type { JobApplicationDocument } from '../models/job-application.model';

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
    const docs = await JobApplicationModel.find({ jobId }).sort({ createdAt: -1 });
    return docs.map(JobApplicationMapper.toEntity);
  }

  // All interview-related operations are now handled by the new ATS system
  // See ATSInterviewRepository for interview management
}

