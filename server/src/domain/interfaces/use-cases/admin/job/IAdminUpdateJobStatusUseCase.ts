import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { UpdateJobStatusRequestDto } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, dto: UpdateJobStatusRequestDto): Promise<JobPosting>;
}
