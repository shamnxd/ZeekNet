import { GetCompanyJobPostingsResponseDto } from 'src/application/dtos/company/responses/company-job-postings-response.dto';
import { JobPostingQueryRequestDto } from 'src/application/dtos/job-posting/common/get-job-postings-query.dto';


export interface IGetCompanyJobPostingsUseCase {
  execute(data: JobPostingQueryRequestDto): Promise<GetCompanyJobPostingsResponseDto>;
}

