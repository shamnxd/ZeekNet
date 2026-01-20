import { NextFunction, Request, Response } from 'express';
import { IAdminDeleteJobUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminDeleteJobUseCase';
import { IAdminGetAllJobsUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetAllJobsUseCase';
import { IAdminGetJobByIdUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetJobByIdUseCase';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IAdminGetJobStatsUseCase';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminUpdateJobStatusUseCase';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';
import { UpdateJobStatusRequestDtoSchema } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';
import { GetAllJobsQueryDto } from 'src/application/dtos/admin/job/requests/get-all-jobs-query.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminJobController {
  constructor(
    private readonly _getAllJobsUseCase: IAdminGetAllJobsUseCase,
    private readonly _getJobByIdUseCase: IAdminGetJobByIdUseCase,
    private readonly _updateJobStatusUseCase: IAdminUpdateJobStatusUseCase,
    private readonly _deleteJobUseCase: IAdminDeleteJobUseCase,
    private readonly _getJobStatsUseCase: IAdminGetJobStatsUseCase,
  ) { }

  getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllJobsQueryDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllJobsUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Jobs retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      const job = await this._getJobByIdUseCase.execute(parsedParams.data.id);
      sendSuccessResponse(res, 'Job retrieved successfully', job);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    const parsedBody = UpdateJobStatusRequestDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      await this._updateJobStatusUseCase.execute(parsedParams.data.id, parsedBody.data);
      const message = `Job status updated to '${parsedBody.data.status}' successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      await this._deleteJobUseCase.execute(parsedParams.data.id);
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
