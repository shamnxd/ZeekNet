import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export interface IGetJobPostingUseCase {
  execute(jobId: string): Promise<JobPostingResponseDto>;
}
