import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { UpdateCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/update-company-job-posting.dto';

export interface IUpdateJobPostingUseCase {
  execute(dto: UpdateCompanyJobPostingDto): Promise<JobPostingResponseDto>;
}

