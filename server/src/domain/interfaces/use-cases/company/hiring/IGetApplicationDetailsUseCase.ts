import { GetApplicationDetailsRequestDto } from 'src/application/dtos/company/hiring/requests/get-application-details.dto';
import type { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';


export interface IGetApplicationDetailsUseCase {
  execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto>;
}

