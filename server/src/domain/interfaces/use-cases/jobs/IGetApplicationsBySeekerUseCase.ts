import { GetApplicationsBySeekerRequestDto } from 'src/application/dto/application/get-applications-by-seeker.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dto/application/job-application-response.dto';


export interface IGetApplicationsBySeekerUseCase {
  execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto>;
}
