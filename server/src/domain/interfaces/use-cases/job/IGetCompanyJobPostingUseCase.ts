import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { GetCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/get-company-job-posting.dto';

export interface IGetCompanyJobPostingUseCase {
  execute(dto: GetCompanyJobPostingDto): Promise<JobPostingResponseDto>;
}
