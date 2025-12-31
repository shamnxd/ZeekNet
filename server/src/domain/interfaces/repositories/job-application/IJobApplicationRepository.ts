import type { JobApplication } from '../../../entities/job-application.entity';
import { IBaseRepository } from '../IBaseRepository';
import { CreateInput } from '../../../types/common.types';

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

