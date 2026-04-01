import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IGetCompanyDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/company/dashboard/IGetCompanyDashboardStatsUseCase';
import { handleAsyncError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';

export class CompanyDashboardController {
  constructor(private readonly _getCompanyDashboardStatsUseCase: IGetCompanyDashboardStatsUseCase) { }

  getCompanyDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const stats = await this._getCompanyDashboardStatsUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company dashboard stats'), stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

