import { AdminJobListResponseDto } from 'src/application/dtos/admin/responses/admin-job-response.dto';
import { JobPostingFilters } from 'src/application/dtos/jobs/common/job-posting-filters.dto';

export interface IAdminGetAllJobsUseCase {
  execute(query: JobPostingFilters): Promise<AdminJobListResponseDto>;
}

