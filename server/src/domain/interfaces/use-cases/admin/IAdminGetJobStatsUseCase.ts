import { AdminJobStatsResponseDto } from 'src/application/dto/admin/admin-job-response.dto';

export interface IAdminGetJobStatsUseCase {
  execute(): Promise<AdminJobStatsResponseDto>;
}
