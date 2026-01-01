import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';
import { CreateInput } from 'src/domain/types/common.types';

export interface IJobPostingRepository extends IBaseRepository<JobPosting> {
  postJob(job: JobPosting): Promise<JobPosting>;
  findByIds(ids: string[]): Promise<JobPosting[]>;
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
