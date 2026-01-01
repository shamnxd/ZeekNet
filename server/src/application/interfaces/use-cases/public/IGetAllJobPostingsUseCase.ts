import { GetAllJobPostingsResponseDto } from 'src/application/dto/public/public-job-postings-response.dto';
import { JobPostingFilters } from 'src/application/dto/jobs/job-posting-filters.dto';


export interface IGetAllJobPostingsUseCase {
  execute(query: JobPostingFilters): Promise<GetAllJobPostingsResponseDto>;
}
