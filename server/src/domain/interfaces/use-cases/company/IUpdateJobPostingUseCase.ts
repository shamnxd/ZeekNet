import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { UpdateJobPostingData } from '../jobs/UpdateJobPostingData';


export interface IUpdateJobPostingUseCase {
  execute(data: UpdateJobPostingData): Promise<JobPosting>;
}
