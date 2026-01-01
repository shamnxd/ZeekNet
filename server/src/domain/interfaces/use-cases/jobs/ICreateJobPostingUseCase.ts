import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CreateJobPostingRequestDto } from 'src/application/dtos/job-posting/common/create-job-posting-request.dto';


export interface ICreateJobPostingUseCase {
  execute(data: CreateJobPostingRequestDto & { userId?: string }): Promise<JobPosting>;
}

