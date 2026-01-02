import { GetApplicationsByJobRequestDto } from 'src/application/dtos/company/hiring/requests/get-applications-by-job.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';


export interface IGetApplicationsByJobUseCase {
  execute(data: GetApplicationsByJobRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

