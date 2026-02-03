import { Response, NextFunction } from 'express';
import { CreateJobPostingRequestDtoSchema } from 'src/application/dtos/admin/job/requests/create-job-posting-request.dto';
import { UpdateJobPostingDto } from 'src/application/dtos/admin/job/requests/update-job-posting-request.dto';
import { JobPostingQueryDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';
import { UpdateJobStatusDto } from 'src/application/dtos/company/job/requests/update-job-status.dto';
import { ReopenJobDto } from 'src/application/dtos/company/job/requests/reopen-job.dto';
import { ICreateJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/ICreateJobPostingUseCase';
import { IGetCompanyJobPostingsUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingsUseCase';
import { IUpdateJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IUpdateJobPostingUseCase';
import { IDeleteJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IDeleteJobPostingUseCase';
import { IUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/job/IUpdateJobStatusUseCase';
import { IGetCompanyJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingUseCase';
import { ICloseJobManuallyUseCase } from 'src/domain/interfaces/use-cases/job/ICloseJobManuallyUseCase';
import { IReopenJobUseCase } from 'src/domain/interfaces/use-cases/job/IReopenJobUseCase';
import { IToggleFeaturedJobUseCase } from 'src/domain/interfaces/use-cases/job/IToggleFeaturedJobUseCase';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
  sendCreatedResponse,
} from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyJobPostingController {
  constructor(
    private readonly _createJobPostingUseCase: ICreateJobPostingUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
    private readonly _updateJobPostingUseCase: IUpdateJobPostingUseCase,
    private readonly _deleteJobPostingUseCase: IDeleteJobPostingUseCase,
    private readonly _updateJobStatusUseCase: IUpdateJobStatusUseCase,
    private readonly _getCompanyJobPostingUseCase: IGetCompanyJobPostingUseCase,
    private readonly _closeJobManuallyUseCase: ICloseJobManuallyUseCase,
    private readonly _reopenJobUseCase: IReopenJobUseCase,
    private readonly _toggleFeaturedJobUseCase: IToggleFeaturedJobUseCase,
  ) { }

  createJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const parsed = CreateJobPostingRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const responseDto = await this._createJobPostingUseCase.execute({ userId, ...parsed.data });
      sendCreatedResponse(res, 'Job posting created successfully', responseDto);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      const responseDto = await this._getCompanyJobPostingUseCase.execute({ jobId: id, userId });

      sendSuccessResponse(res, 'Job posting retrieved successfully', responseDto);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyJobPostings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const parsed = JobPostingQueryDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getCompanyJobPostingsUseCase.execute({ userId, ...parsed.data });

      sendSuccessResponse(res, 'Company job postings retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const bodyParsed = UpdateJobPostingDto.safeParse(req.body);
    if (!bodyParsed.success) {
      return handleValidationError(formatZodErrors(bodyParsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      const responseDto = await this._updateJobPostingUseCase.execute({
        jobId: id,
        userId,
        ...bodyParsed.data,
      });

      sendSuccessResponse(res, 'Job posting updated successfully', responseDto);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._deleteJobPostingUseCase.execute({ jobId: id, userId });

      sendSuccessResponse(res, 'Job posting deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const bodyParsed = UpdateJobStatusDto.safeParse(req.body);

    if (!bodyParsed.success) {
      return handleValidationError(formatZodErrors(bodyParsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      const responseDto = await this._updateJobStatusUseCase.execute({
        jobId: id,
        status: bodyParsed.data.status,
        userId,
      });

      sendSuccessResponse(res, `Job status updated to '${bodyParsed.data.status}' successfully`, responseDto);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  closeJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      await this._closeJobManuallyUseCase.execute({ userId, jobId: id });

      sendSuccessResponse(res, 'Job closed successfully. All remaining candidates have been notified.', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  reopenJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const bodyParsed = ReopenJobDto.safeParse(req.body);

    if (!bodyParsed.success) {
      return handleValidationError(formatZodErrors(bodyParsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      const { id } = req.params;
      const { additionalVacancies } = bodyParsed.data;

      await this._reopenJobUseCase.execute({
        userId,
        jobId: id,
        additionalVacancies,
      });

      sendSuccessResponse(res, `Job reopened successfully with ${additionalVacancies} additional ${additionalVacancies === 1 ? 'vacancy' : 'vacancies'}.`, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  toggleFeatured = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const responseDto = await this._toggleFeaturedJobUseCase.execute({ userId, jobId: id });

      sendSuccessResponse(res, 'Job featured status updated successfully', responseDto);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
