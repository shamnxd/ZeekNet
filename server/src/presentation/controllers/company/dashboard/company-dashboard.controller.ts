import { Response, NextFunction } from 'express';
import { GetCompanyDashboardStatsUseCase } from 'src/application/use-cases/company/dashboard/get-company-dashboard-stats.use-case';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { 
  validateUserId, 
  sendSuccessResponse, 
  handleAsyncError 
} from 'src/shared/utils/presentation/controller.utils';

export class CompanyDashboardController {
  constructor(private _getCompanyDashboardStatsUseCase: GetCompanyDashboardStatsUseCase) {}

  getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const period = (req.query.period as 'week' | 'month') || 'week';
      
      const stats = await this._getCompanyDashboardStatsUseCase.execute(userId, period);
      sendSuccessResponse(res, 'Company dashboard statistics retrieved successfully', stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  }
}
