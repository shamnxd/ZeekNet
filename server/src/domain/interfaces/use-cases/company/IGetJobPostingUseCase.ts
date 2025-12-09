import { JobPosting } from 'src/domain/entities/job-posting.entity';


export interface IGetJobPostingUseCase {
  execute(jobId: string): Promise<JobPosting>;
}
