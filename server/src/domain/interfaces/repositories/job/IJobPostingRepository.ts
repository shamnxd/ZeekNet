import { JobPosting } from '../../../entities/job-posting.entity';

// Thin CRUD repository interface
export interface IJobPostingRepository {
  create(data: Partial<JobPosting>): Promise<JobPosting>;
  findById(id: string): Promise<JobPosting | null>;
  findOne(criteria: Partial<JobPosting>): Promise<JobPosting | null>;
  findMany(criteria: Partial<JobPosting>): Promise<JobPosting[]>;
  update(id: string, data: Partial<JobPosting>): Promise<JobPosting | null>;
  delete(id: string): Promise<void>;
  exists(criteria: Partial<JobPosting>): Promise<boolean>;
  count(criteria: Partial<JobPosting>): Promise<number>;
}