import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from '../../../shared/utils/controller.utils';
import { IUpdateApplicationScoreUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationScoreUseCase';
import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationStageUseCase';
import { IGetApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationDetailsUseCase';
import { IGetApplicationsByCompanyUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsByCompanyUseCase';
import { IGetApplicationsByJobUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsByJobUseCase';
import { IBulkUpdateApplicationsUseCase } from '../../../domain/interfaces/use-cases/company/IBulkUpdateApplicationsUseCase';
import { ApplicationFiltersDto } from '../../../application/dto/application/application-filters.dto';
import { UpdateApplicationStageDto } from '../../../application/dto/application/update-application-stage.dto';
import { UpdateScoreDto } from '../../../application/dto/application/update-score.dto';
import { BulkUpdateApplicationsDto } from '../../../application/dto/application/bulk-update-applications.dto';
import { MarkCandidateHiredUseCase } from '../../../application/use-cases/company/mark-candidate-hired.use-case';
import { z } from 'zod';

export class CompanyJobApplicationController {
  constructor(
    private readonly _getApplicationsByJobUseCase: IGetApplicationsByJobUseCase,
    private readonly _getApplicationsByCompanyUseCase: IGetApplicationsByCompanyUseCase,
    private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
    private readonly _updateApplicationStageUseCase: IUpdateApplicationStageUseCase,
    private readonly _updateApplicationScoreUseCase: IUpdateApplicationScoreUseCase,
    private readonly _bulkUpdateApplicationsUseCase: IBulkUpdateApplicationsUseCase,
    private readonly _markCandidateHiredUseCase: MarkCandidateHiredUseCase,
  ) {}

  getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { job_id } = req.query;

      const filters = ApplicationFiltersDto.safeParse(req.query);
      if (!filters.success) {
        return handleValidationError(
          `Validation error: ${filters.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      let result;
      if (job_id) {
        result = await this._getApplicationsByJobUseCase.execute({
          jobId: job_id as string,
          ...filters.data,
          userId,
        });
      } else {
        result = await this._getApplicationsByCompanyUseCase.execute({ ...filters.data, userId });
      }

      sendSuccessResponse(res, 'Applications retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplicationDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const response = await this._getApplicationDetailsUseCase.execute({ userId, applicationId: id });

      sendSuccessResponse(res, 'Application details retrieved successfully', response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._updateApplicationStageUseCase.execute({
        userId,
        applicationId: id,
        stage: req.body.stage,
        subStage: req.body.subStage,
        rejectionReason: req.body.rejectionReason,
      });

      sendSuccessResponse(res, 'Application stage updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const dto = UpdateScoreDto.safeParse(req.body);
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const application = await this._updateApplicationScoreUseCase.execute({ userId, applicationId: id, score: dto.data.score });

      sendSuccessResponse(res, 'Application score updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  bulkUpdate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const dto = BulkUpdateApplicationsDto.safeParse(req.body);
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const result = await this._bulkUpdateApplicationsUseCase.execute({
        ...dto.data,
        companyId: userId,
      });

      sendSuccessResponse(res, 'Applications updated successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsHired = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

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



