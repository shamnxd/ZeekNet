import { JobPosting } from '../../../entities/job-posting.entity';
import { IBaseRepository } from '../IBaseRepository';

// Use base repository methods
export interface IJobPostingRepository extends IBaseRepository<JobPosting> {
  // All CRUD operations available from base
  // Use findOne(criteria), findMany(criteria), exists(criteria), countDocuments(criteria)
}