import { GetApplicationDetailsRequestDto } from 'src/application/dtos/job-application/requests/get-application-details.dto';
import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';


export interface IGetApplicationDetailsUseCase {
  execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto>;
}

