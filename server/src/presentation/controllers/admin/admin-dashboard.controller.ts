import { NextFunction, Request, Response } from 'express';
import { IGetAdminDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IGetAdminDashboardStatsUseCase';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminDashboardController {
  constructor(
    @inject(TYPES.GetAdminDashboardStatsUseCase) private getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
  ) { }

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = GetAdminDashboardStatsQueryDto.safeParse(req.query);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const stats = await this.getAdminDashboardStatsUseCase.execute(parsed.data);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Admin dashboard statistics'), stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

