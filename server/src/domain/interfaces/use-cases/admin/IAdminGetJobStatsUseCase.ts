import { AdminJobStatsResponseDto } from 'src/application/dtos/admin/responses/admin-job-response.dto';

export interface IAdminGetJobStatsUseCase {
  execute(): Promise<AdminJobStatsResponseDto>;
}

