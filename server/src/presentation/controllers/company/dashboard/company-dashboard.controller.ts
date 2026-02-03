import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { IGetCompanyDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/company/dashboard/IGetCompanyDashboardStatsUseCase';

export class CompanyDashboardController {
  constructor(private readonly _getCompanyDashboardStatsUseCase: IGetCompanyDashboardStatsUseCase) {}

  getCompanyDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const stats = await this._getCompanyDashboardStatsUseCase.execute(userId);
      sendSuccessResponse(res, 'Company dashboard stats retrieved successfully', stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
