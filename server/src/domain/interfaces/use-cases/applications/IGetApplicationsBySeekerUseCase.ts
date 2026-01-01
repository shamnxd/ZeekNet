import { GetApplicationsBySeekerRequestDto } from 'src/application/dtos/job-application/requests/get-applications-by-seeker.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';


export interface IGetApplicationsBySeekerUseCase {
  execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

