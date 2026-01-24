import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { CreateJobPostingRequestDto } from 'src/application/dtos/admin/job/requests/create-job-posting-request.dto';


export interface ICreateJobPostingUseCase {
  execute(data: CreateJobPostingRequestDto): Promise<JobPostingResponseDto>;
}

