import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { UpdateJobStatusDto } from 'src/application/dtos/job/requests/update-job-status.dto';

export interface IUpdateJobStatusUseCase {
  execute(dto: UpdateJobStatusDto): Promise<JobPosting>;
}

