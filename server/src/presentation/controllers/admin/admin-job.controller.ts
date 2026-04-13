import { NextFunction, Request, Response } from 'express';
import { IAdminDeleteJobUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminDeleteJobUseCase';
import { IAdminGetAllJobsUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetAllJobsUseCase';
import { IAdminGetJobByIdUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetJobByIdUseCase';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IAdminGetJobStatsUseCase';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminUpdateJobStatusUseCase';
import { UpdateJobStatusRequestDtoSchema } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';
import { GetAllJobsQueryDto } from 'src/application/dtos/admin/job/requests/get-all-jobs-query.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminJobController {
  constructor(
    @inject(TYPES.AdminGetAllJobsUseCase) private readonly _getAllJobsUseCase: IAdminGetAllJobsUseCase,
    @inject(TYPES.AdminGetJobByIdUseCase) private readonly _getJobByIdUseCase: IAdminGetJobByIdUseCase,
    @inject(TYPES.AdminUpdateJobStatusUseCase) private readonly _updateJobStatusUseCase: IAdminUpdateJobStatusUseCase,
    @inject(TYPES.AdminDeleteJobUseCase) private readonly _deleteJobUseCase: IAdminDeleteJobUseCase,
    @inject(TYPES.AdminGetJobStatsUseCase) private readonly _getJobStatsUseCase: IAdminGetJobStatsUseCase,
  ) {}

  getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllJobsQueryDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllJobsUseCase.execute(parsed.data);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Jobs'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await this._getJobByIdUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job'), job);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = UpdateJobStatusRequestDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const { id } = req.params;
      await this._updateJobStatusUseCase.execute(id, parsedBody.data);
      sendSuccessResponse(res, SUCCESS.UPDATED('Job status'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._deleteJobUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.DELETED('Job'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this._getJobStatsUseCase.execute();
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job statistics'), stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
