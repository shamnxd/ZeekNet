import { GetApplicationsBySeekerRequestDto } from 'src/application/dtos/seeker/applications/requests/get-applications-by-seeker.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';


export interface IGetApplicationsBySeekerUseCase {
  execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

