import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { UpdateJobStatusRequestDto } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, dto: UpdateJobStatusRequestDto): Promise<JobPostingResponseDto>;
}
