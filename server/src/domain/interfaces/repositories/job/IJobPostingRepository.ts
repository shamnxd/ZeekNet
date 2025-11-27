import { JobPosting } from '../../../entities/job-posting.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface IJobPostingRepository extends IBaseRepository<JobPosting> {
  postJob(jobData: Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<JobPosting>;
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
}