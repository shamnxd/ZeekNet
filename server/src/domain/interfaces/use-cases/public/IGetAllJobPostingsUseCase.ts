import { GetAllJobPostingsResponseDto } from 'src/application/dto/public/public-job-postings-response.dto';
import { JobPostingFilters } from 'src/domain/entities/job-posting.entity';


export interface IGetAllJobPostingsUseCase {
  execute(query: JobPostingFilters): Promise<GetAllJobPostingsResponseDto>;
}
