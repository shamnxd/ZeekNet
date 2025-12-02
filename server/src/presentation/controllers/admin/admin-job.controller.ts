import { Request, Response, NextFunction } from 'express';
import { AdminGetAllJobsDtoType, AdminUpdateJobStatusDto } from '../../../application/dto/admin/admin-job.dto';
import { IAdminGetAllJobsUseCase, IAdminGetJobByIdUseCase, IAdminUpdateJobStatusUseCase, IAdminDeleteJobUseCase, IAdminGetJobStatsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { handleValidationError } from '../../../shared/utils/controller.utils';
import { handleAsyncError } from '../../../shared/utils/controller.utils';
import { sendSuccessResponse } from '../../../shared/utils/controller.utils';

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
      
      const query = req.query as unknown as AdminGetAllJobsDtoType;
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