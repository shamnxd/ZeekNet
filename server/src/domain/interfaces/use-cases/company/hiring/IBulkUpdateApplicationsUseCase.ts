import { BulkUpdateApplicationsRequestDto } from 'src/application/dtos/company/hiring/requests/bulk-update-applications.dto';
import { BulkUpdateApplicationsResponseDto } from 'src/application/dtos/company/hiring/responses/bulk-update-applications-response.dto';

export interface IBulkUpdateApplicationsUseCase {
  execute(dto: BulkUpdateApplicationsRequestDto): Promise<BulkUpdateApplicationsResponseDto>;
}

