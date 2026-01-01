import { ApplicationFiltersRequestDto } from 'src/application/dtos/company/hiring/requests/application-filters.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';


export interface IGetApplicationsByCompanyUseCase {
  execute(data: ApplicationFiltersRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

