import { GetCompanyJobPostingsResponseDto } from 'src/application/dtos/company/responses/company-job-postings-response.dto';
import { JobPostingQueryRequestDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';


export interface IGetCompanyJobPostingsUseCase {
  execute(data: JobPostingQueryRequestDto): Promise<GetCompanyJobPostingsResponseDto>;
}

