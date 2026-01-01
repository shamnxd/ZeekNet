import { Request, Response, NextFunction } from 'express';
import { GetAllJobsQueryDtoType } from 'src/application/dtos/admin/job/requests/get-all-jobs-query.dto';
import { AdminUpdateJobStatusDto } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IAdminGetJobStatsUseCase';
import { IAdminDeleteJobUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminDeleteJobUseCase';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminUpdateJobStatusUseCase';
import { IAdminGetJobByIdUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetJobByIdUseCase';
import { IAdminGetAllJobsUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetAllJobsUseCase';
import { handleValidationError } from 'src/shared/utils/presentation/controller.utils';
import { handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminJobController {
  constructor(
    private readonly _getAllJobsUseCase: IAdminGetAllJobsUseCase,
    private readonly _getJobByIdUseCase: IAdminGetJobByIdUseCase,
    private readonly _updateJobStatusUseCase: IAdminUpdateJobStatusUseCase,
    private readonly _deleteJobUseCase: IAdminDeleteJobUseCase,
    private readonly _getJobStatsUseCase: IAdminGetJobStatsUseCase,
  ) {}

  getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const query = req.query as unknown as GetAllJobsQueryDtoType;
      const result = await this._getAllJobsUseCase.execute(query);
      sendSuccessResponse(res, 'Jobs retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job ID is required', next);
    }

    try {
      const job = await this._getJobByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Job retrieved successfully', job);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job ID is required', next);
    }

    const parsed = AdminUpdateJobStatusDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError('Invalid status data', next);
    }

    try {
      await this._updateJobStatusUseCase.execute(id, parsed.data.status, parsed.data.unpublish_reason);
      const message = `Job status updated to '${parsed.data.status}' successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Job ID is required', next);
    }

    try {
      await this._deleteJobUseCase.execute(id);
      sendSuccessResponse(res, 'Job deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this._getJobStatsUseCase.execute();
      sendSuccessResponse(res, 'Job statistics retrieved successfully', stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

