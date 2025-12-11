import { AdminJobListResponseDto } from 'src/application/dto/admin/admin-job-response.dto';
import { JobPostingFilters } from 'src/application/dto/jobs/job-posting-filters.dto';

export interface IAdminGetAllJobsUseCase {
  execute(query: JobPostingFilters): Promise<AdminJobListResponseDto>;
}
