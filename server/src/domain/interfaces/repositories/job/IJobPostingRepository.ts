import { JobPosting } from '../../../entities/job-posting.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface IJobPostingRepository extends IBaseRepository<JobPosting> {
  // All CRUD operations available from base
  
  // Specific method for creating job postings
  postJob(jobData: Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<JobPosting>;

  // Get all active jobs for public (with company info, excluding blocked)
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

  // Get jobs by specific company (for company dashboard)
  getJobsByCompany(companyId: string, projection: Record<string, 1 | 0>): Promise<Partial<JobPosting>[]>;

  // Get all jobs for admin (all jobs with full info)
  getAllJobsForAdmin(): Promise<JobPosting[]>;
}