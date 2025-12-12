import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { UpdateJobPostingRequestDto } from 'src/application/dto/job-posting/update-job-posting-request.dto';


export interface IUpdateJobPostingUseCase {
  execute(data: UpdateJobPostingRequestDto & { jobId?: string }): Promise<JobPosting>;
}
