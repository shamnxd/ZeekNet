import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export interface IAdminGetJobByIdUseCase {
  execute(jobId: string): Promise<JobPostingResponseDto>;
}
