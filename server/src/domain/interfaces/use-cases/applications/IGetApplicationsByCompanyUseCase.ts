import { ApplicationFiltersRequestDto } from 'src/application/dto/application/application-filters.dto';
import type { PaginatedApplicationsResponseDto } from 'src/application/dto/application/job-application-response.dto';


export interface IGetApplicationsByCompanyUseCase {
  execute(data: ApplicationFiltersRequestDto): Promise<PaginatedApplicationsResponseDto>;
}
