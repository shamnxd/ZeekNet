import { JobPosting } from 'src/domain/entities/job-posting.entity';

export interface IAdminGetJobByIdUseCase {
  execute(jobId: string): Promise<JobPosting>;
}
