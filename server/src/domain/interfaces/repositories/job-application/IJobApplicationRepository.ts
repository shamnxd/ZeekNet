import type { JobApplication } from 'src/domain/entities/job-application.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface PaginatedApplications {
  applications: JobApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IJobApplicationRepository extends IBaseRepository<JobApplication> {
  findByJobId(jobId: string): Promise<JobApplication[]>;
}

