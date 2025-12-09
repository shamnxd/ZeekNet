import { GetApplicationsByJobRequestDto } from 'src/application/dto/application/get-applications-by-job.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dto/application/job-application-response.dto';


export interface IGetApplicationsByJobUseCase {
  execute(data: GetApplicationsByJobRequestDto): Promise<PaginatedApplicationsResponseDto>;
}
