import { JobPostingDetailResponseDto } from 'src/application/dto/job-posting/job-posting-response.dto';


export interface IGetJobPostingForPublicUseCase {
  execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto>;
}
