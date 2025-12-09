import { GetCompanyJobPostingsResponseDto } from 'src/application/dto/company/company-job-postings-response.dto';
import { JobPostingQueryRequestDto } from 'src/application/dto/job-posting/job-posting.dto';


export interface IGetCompanyJobPostingsUseCase {
  execute(data: JobPostingQueryRequestDto): Promise<GetCompanyJobPostingsResponseDto>;
}
