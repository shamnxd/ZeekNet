import { AdminJobListResponseDto } from 'src/application/dto/admin/admin-job-response.dto';
import { JobPostingFilters } from 'src/domain/entities/job-posting.entity';

export interface IAdminGetAllJobsUseCase {
  execute(query: JobPostingFilters): Promise<AdminJobListResponseDto>;
}
