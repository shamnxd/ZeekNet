import { JobPosting } from 'src/domain/entities/job-posting.entity';

// be

export interface IUpdateJobStatusUseCase {
  execute(data: { jobId: string; status: 'active' | 'unlisted' | 'expired' | 'blocked'; userId?: string; }): Promise<JobPosting>;
}
