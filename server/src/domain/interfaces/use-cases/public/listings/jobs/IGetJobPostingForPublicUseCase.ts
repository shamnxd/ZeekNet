import { JobPostingDetailResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';


export interface IGetJobPostingForPublicUseCase {
  execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto>;
}

