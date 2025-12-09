import { JobPosting } from 'src/domain/entities/job-posting.entity';

// be
export interface IUpdateJobStatusUseCase {
  execute(jobId: string, status: 'active' | 'unlisted' | 'expired' | 'blocked', userId?: string): Promise<JobPosting>;
}
