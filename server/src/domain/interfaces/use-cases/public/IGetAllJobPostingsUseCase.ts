import { GetAllJobPostingsResponseDto } from 'src/application/dtos/public/responses/public-job-postings-response.dto';
import { JobPostingFilters } from 'src/application/dtos/jobs/common/job-posting-filters.dto';


export interface IGetAllJobPostingsUseCase {
  execute(query: JobPostingFilters): Promise<GetAllJobPostingsResponseDto>;
}

