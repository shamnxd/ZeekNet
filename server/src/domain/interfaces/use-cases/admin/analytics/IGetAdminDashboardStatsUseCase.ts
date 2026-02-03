import { AdminDashboardStatsResponseDto } from 'src/application/dtos/admin/analytics/responses/admin-dashboard-stats-response.dto';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';

export interface IGetAdminDashboardStatsUseCase {
  execute(query: GetAdminDashboardStatsQueryDto): Promise<AdminDashboardStatsResponseDto>;
}