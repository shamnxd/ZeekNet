import { JobPosting } from '../../../entities/job-posting.entity';
import { IBaseRepository } from '../IBaseRepository';
import { CreateInput } from '../../../types/common.types';

export interface IJobPostingRepository extends IBaseRepository<JobPosting> {
  postJob(jobData: CreateInput<JobPosting>): Promise<JobPosting>;
  getAllJobsForPublic(
    projection: Record<string, 1 | 0>,
    filters?: {
      categoryIds?: string[];
      employmentTypes?: string[];
      salaryMin?: number;
      salaryMax?: number;
      location?: string;
      search?: string;
    }
  ): Promise<Partial<JobPosting>[]>;
  getJobsByCompany(companyId: string, projection: Record<string, 1 | 0>): Promise<Partial<JobPosting>[]>;
  getAllJobsForAdmin(): Promise<JobPosting[]>;
  countActiveJobsByCompany(companyId: string): Promise<number>;
}
