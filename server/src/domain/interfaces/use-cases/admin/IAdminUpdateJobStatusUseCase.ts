import { JobPosting } from 'src/domain/entities/job-posting.entity';

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, status: 'active' | 'unlisted' | 'expired' | 'blocked', unpublishReason?: string): Promise<JobPosting>;
}
