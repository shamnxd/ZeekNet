import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CreateJobPostingRequestDto } from 'src/application/dtos/admin/job/requests/create-job-posting-request.dto';


export interface ICreateJobPostingUseCase {
  execute(data: CreateJobPostingRequestDto & { userId?: string }): Promise<JobPosting>;
}

