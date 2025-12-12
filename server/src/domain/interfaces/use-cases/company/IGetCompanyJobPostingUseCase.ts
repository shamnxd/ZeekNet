import { JobPosting } from 'src/domain/entities/job-posting.entity';


export interface IGetCompanyJobPostingUseCase {
  execute(jobId: string, companyId: string): Promise<JobPosting>;
}
