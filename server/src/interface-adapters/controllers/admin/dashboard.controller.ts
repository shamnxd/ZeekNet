import { Request, Response } from 'express';
import { GetAdminDashboardStatsUseCase } from 'src/application/use-cases/admin/dashboard/get-admin-dashboard-stats.use-case';

export class AdminDashboardController {
  constructor(
    private getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase,
  ) {}

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const period = (req.query.period as 'day' | 'week' | 'month' | 'year') || 'month';
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const stats = await this.getAdminDashboardStatsUseCase.execute(period, startDate, endDate);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
