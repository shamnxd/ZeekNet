import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { UpdateJobPostingRequestDto } from 'src/application/dtos/admin/job/requests/update-job-posting-request.dto';


export interface IUpdateJobPostingUseCase {
  execute(data: UpdateJobPostingRequestDto & { jobId?: string }): Promise<JobPosting>;
}

