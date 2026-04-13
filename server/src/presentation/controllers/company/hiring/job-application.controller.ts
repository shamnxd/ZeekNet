import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { TYPES } from 'src/shared/constants/types';
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
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS, VALIDATION } from 'src/shared/constants/messages';

@injectable()
export class CompanyJobApplicationController {
  constructor(
    @inject(TYPES.GetApplicationsByJobUseCase) private readonly _getApplicationsByJobUseCase: IGetApplicationsByJobUseCase,
    @inject(TYPES.GetApplicationsByCompanyUseCase) private readonly _getApplicationsByCompanyUseCase: IGetApplicationsByCompanyUseCase,
    @inject(TYPES.GetCompanyApplicationDetailsUseCase) private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
    @inject(TYPES.CompanyUpdateApplicationStageUseCase) private readonly _updateApplicationStageUseCase: IUpdateApplicationStageUseCase,
    @inject(TYPES.UpdateApplicationScoreUseCase) private readonly _updateApplicationScoreUseCase: IUpdateApplicationScoreUseCase,
    @inject(TYPES.BulkUpdateApplicationsUseCase) private readonly _bulkUpdateApplicationsUseCase: IBulkUpdateApplicationsUseCase,
    @inject(TYPES.MarkCandidateHiredUseCase) private readonly _markCandidateHiredUseCase: IMarkCandidateHiredUseCase,
  ) { }

  getCompanyApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const parsed = ApplicationFiltersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getApplicationsByCompanyUseCase.execute({ ...parsed.data, userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Company applications'), result);
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
      return handleValidationError(VALIDATION.REQUIRED('Job ID'), next);
    }

    try {
      const result = await this._getApplicationsByJobUseCase.execute({
        jobId: job_id,
        ...parsed.data,
        userId,
      });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Job applications'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplicationDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    if (!id) {
      return handleValidationError(VALIDATION.REQUIRED('Application ID'), next);
    }

    try {
      const response = await this._getApplicationDetailsUseCase.execute({ userId, applicationId: id });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Application details'), response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    const bodyParsed = UpdateApplicationStageRequestDtoSchema.safeParse(req.body);

    if (!id) {
      return handleValidationError(VALIDATION.REQUIRED('Application ID'), next);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Application stage'), application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    const bodyParsed = UpdateScoreDto.safeParse(req.body);

    if (!id) {
      return handleValidationError(VALIDATION.REQUIRED('Application ID'), next);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Application score'), application);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Applications'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsHired = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = validateUserId(req);
    const { id } = req.params;
    if (!id) {
      return handleValidationError(VALIDATION.REQUIRED('Application ID'), next);
    }

    try {
      await this._markCandidateHiredUseCase.execute({
        userId,
        applicationId: id,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Hiring candidate'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}








