import { GetApplicationsByJobRequestDto } from 'src/application/dtos/job-application/requests/get-applications-by-job.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';


export interface IGetApplicationsByJobUseCase {
  execute(data: GetApplicationsByJobRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

