import { JobPosting } from '../../../entities/job-posting.entity';
import { JobStatus } from '../../../enums/job-status.enum';

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, status: JobStatus, unpublishReason?: string): Promise<JobPosting>;
}
