import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CreateJobPostingData } from './CreateJobPostingData';


export interface ICreateJobPostingUseCase {
  execute(data: CreateJobPostingData): Promise<JobPosting>;
}
