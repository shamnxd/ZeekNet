import { AdminUpdateJobStatusRequestDto } from 'src/application/dto/admin/admin-job.dto';
import { JobPosting } from 'src/domain/entities/job-posting.entity';

export interface IAdminUpdateJobStatusUseCase {
  execute(data: AdminUpdateJobStatusRequestDto): Promise<JobPosting>;
}
