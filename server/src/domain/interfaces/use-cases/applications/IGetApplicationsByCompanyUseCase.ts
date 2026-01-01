import { ApplicationFiltersRequestDto } from 'src/application/dtos/job-application/requests/application-filters.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';


export interface IGetApplicationsByCompanyUseCase {
  execute(data: ApplicationFiltersRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

