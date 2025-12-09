import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CreateJobPostingData } from '../jobs/CreateJobPostingData';


export interface ICreateJobPostingUseCase {
  execute(data: CreateJobPostingData): Promise<JobPosting>;
}
