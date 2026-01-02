import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, status: JobStatus, unpublishReason?: string): Promise<JobPosting>;
}
