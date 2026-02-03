import { Response, NextFunction } from 'express';
import { IUpdateApplicationScoreUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IUpdateApplicationScoreUseCase';
import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IUpdateApplicationStageUseCase';
import { IGetApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetApplicationDetailsUseCase';
import { IGetApplicationsByCompanyUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetApplicationsByCompanyUseCase';
import { IGetApplicationsByJobUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetApplicationsByJobUseCase';
import { IBulkUpdateApplicationsUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IBulkUpdateApplicationsUseCase';
import { IMarkCandidateHiredUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IMarkCandidateHiredUseCase';
import { ApplicationFiltersDto } from 'src/application/dtos/company/hiring/requests/application-filters.dto';
import { UpdateApplicationStageRequestDtoSchema } from 'src/application/dtos/application/requests/update-application-stage.dto';
import { UpdateScoreDto } from 'src/application/dtos/application/requests/update-score.dto';
import { BulkUpdateApplicationsDto } from 'src/application/dtos/company/hiring/requests/bulk-update-applications.dto';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyJobApplicationController {
  constructor(
    private readonly _getApplicationsByJobUseCase: IGetApplicationsByJobUseCase,
    private readonly _getApplicationsByCompanyUseCase: IGetApplicationsByCompanyUseCase,
    private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
    private readonly _updateApplicationStageUseCase: IUpdateApplicationStageUseCase,
    private readonly _updateApplicationScoreUseCase: IUpdateApplicationScoreUseCase,
    private readonly _bulkUpdateApplicationsUseCase: IBulkUpdateApplicationsUseCase,
    private readonly _markCandidateHiredUseCase: IMarkCandidateHiredUseCase,
  ) { }

  getCompanyApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const parsed = ApplicationFiltersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getApplicationsByCompanyUseCase.execute({ ...parsed.data, userId });
      sendSuccessResponse(res, 'Company applications retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { job_id } = req.params;

    const parsed = ApplicationFiltersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    if (!job_id) {
      return handleValidationError('Job ID is required', next);
    }

    try {
      const result = await this._getApplicationsByJobUseCase.execute({
        jobId: job_id,
        ...parsed.data,
        userId,
      });
      sendSuccessResponse(res, 'Job applications retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplicationDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Application ID is required', next);
    }

    try {
      const response = await this._getApplicationDetailsUseCase.execute({ userId, applicationId: id });
      sendSuccessResponse(res, 'Application details retrieved successfully', response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    const bodyParsed = UpdateApplicationStageRequestDtoSchema.safeParse(req.body);

    if (!id) {
      return handleValidationError('Application ID is required', next);
    }
    if (!bodyParsed.success) {
      return handleValidationError(formatZodErrors(bodyParsed.error), next);
    }

    try {
      const application = await this._updateApplicationStageUseCase.execute({
        userId,
        applicationId: id,
        ...bodyParsed.data,
      });

      sendSuccessResponse(res, 'Application stage updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    const bodyParsed = UpdateScoreDto.safeParse(req.body);

    if (!id) {
      return handleValidationError('Application ID is required', next);
    }
    if (!bodyParsed.success) {
      return handleValidationError(formatZodErrors(bodyParsed.error), next);
    }

    try {
      const application = await this._updateApplicationScoreUseCase.execute({
        userId,
        applicationId: id,
        score: bodyParsed.data.score,
      });

      sendSuccessResponse(res, 'Application score updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  bulkUpdate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const parsed = BulkUpdateApplicationsDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._bulkUpdateApplicationsUseCase.execute({
        ...parsed.data,
        companyId: userId,
      });

      sendSuccessResponse(res, 'Applications updated successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsHired = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Application ID is required', next);
    }

    try {
      await this._markCandidateHiredUseCase.execute({
        userId,
        applicationId: id,
      });

      sendSuccessResponse(res, 'Candidate marked as hired successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}






