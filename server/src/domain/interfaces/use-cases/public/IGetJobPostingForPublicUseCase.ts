import { JobPostingDetailResponseDto } from 'src/application/dtos/job-posting/common/job-posting-response.dto';


export interface IGetJobPostingForPublicUseCase {
  execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto>;
}

