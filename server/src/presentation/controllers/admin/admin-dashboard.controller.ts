import { NextFunction, Request, Response } from 'express';
import { IGetAdminDashboardStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IGetAdminDashboardStatsUseCase';
import { GetAdminDashboardStatsQueryDto } from 'src/application/dtos/admin/analytics/requests/get-admin-dashboard-stats-query.dto';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class AdminDashboardController {
  constructor(
    private getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
  ) { }

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = GetAdminDashboardStatsQueryDto.safeParse(req.query);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const stats = await this.getAdminDashboardStatsUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Admin dashboard statistics retrieved successfully', stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
