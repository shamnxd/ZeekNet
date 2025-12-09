import { AdminJobStats } from './AdminJobStats';

export interface IAdminGetJobStatsUseCase {
  execute(): Promise<AdminJobStats>;
}
