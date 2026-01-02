import { AdminJobListResponseDto } from 'src/application/dtos/admin/job/responses/admin-job-response.dto';
import { JobPostingFilters } from 'src/application/dtos/admin/job/requests/job-posting-filters.dto';

export interface IAdminGetAllJobsUseCase {
  execute(query: JobPostingFilters): Promise<AdminJobListResponseDto>;
}

