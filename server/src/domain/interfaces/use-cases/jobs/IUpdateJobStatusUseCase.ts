import { JobPosting } from 'src/domain/entities/job-posting.entity';

export interface IUpdateJobStatusUseCase {
  execute(jobId: string, status: 'active' | 'unlisted' | 'expired' | 'blocked'): Promise<JobPosting>;
}
