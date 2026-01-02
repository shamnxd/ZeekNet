import { NextFunction, Request, Response } from 'express';
import { GetAdminDashboardStatsUseCase } from 'src/application/use-cases/admin/dashboard/get-admin-dashboard-stats.use-case';
import { 
  sendSuccessResponse, 
  handleAsyncError 
} from 'src/shared/utils/presentation/controller.utils';

export class AdminDashboardController {
  constructor(
    private getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase,
  ) {}

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const period = (req.query.period as 'day' | 'week' | 'month' | 'year') || 'month';
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const stats = await this.getAdminDashboardStatsUseCase.execute(period, startDate, endDate);
      sendSuccessResponse(res, 'Admin dashboard statistics retrieved successfully', stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  }
}
