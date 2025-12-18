import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from '../../../shared/utils/controller.utils';
import { IAddInterviewFeedbackUseCase } from 'src/domain/interfaces/use-cases/interview/IAddInterviewFeedbackUseCase';
import { IDeleteInterviewUseCase } from 'src/domain/interfaces/use-cases/interview/IDeleteInterviewUseCase';
import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/interview/IUpdateInterviewUseCase';
import { IAddInterviewUseCase } from 'src/domain/interfaces/use-cases/interview/IAddInterviewUseCase';
import { IUpdateApplicationScoreUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationScoreUseCase';
import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationStageUseCase';
import { IGetApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationDetailsUseCase';
import { IGetApplicationsByCompanyUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsByCompanyUseCase';
import { IGetApplicationsByJobUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsByJobUseCase';
import { IBulkUpdateApplicationsUseCase } from '../../../domain/interfaces/use-cases/company/IBulkUpdateApplicationsUseCase';
import { ApplicationFiltersDto } from '../../../application/dto/application/application-filters.dto';
import { UpdateApplicationStageDto } from '../../../application/dto/application/update-application-stage.dto';
import { UpdateScoreDto } from '../../../application/dto/application/update-score.dto';
import { AddInterviewDto } from '../../../application/dto/application/add-interview.dto';
import { UpdateInterviewDto } from '../../../application/dto/application/update-interview.dto';
import { AddInterviewFeedbackDto } from '../../../application/dto/application/add-interview-feedback.dto';
import { BulkUpdateApplicationsDto } from '../../../application/dto/application/bulk-update-applications.dto';
import { z } from 'zod';

export class CompanyJobApplicationController {
  constructor(
    private readonly _getApplicationsByJobUseCase: IGetApplicationsByJobUseCase,
    private readonly _getApplicationsByCompanyUseCase: IGetApplicationsByCompanyUseCase,
    private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
    private readonly _updateApplicationStageUseCase: IUpdateApplicationStageUseCase,
    private readonly _updateApplicationScoreUseCase: IUpdateApplicationScoreUseCase,
    private readonly _addInterviewUseCase: IAddInterviewUseCase,
    private readonly _updateInterviewUseCase: IUpdateInterviewUseCase,
    private readonly _deleteInterviewUseCase: IDeleteInterviewUseCase,
    private readonly _addInterviewFeedbackUseCase: IAddInterviewFeedbackUseCase,
    private readonly _bulkUpdateApplicationsUseCase: IBulkUpdateApplicationsUseCase,
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

  addInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const dto = AddInterviewDto.safeParse(req.body);
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const interviewData = {
        userId,
        applicationId: id,
        date: new Date(dto.data.interview_date),
        time: dto.data.interview_time,
        interview_type: dto.data.interview_type,
        location: dto.data.location || '',
        interviewer_name: dto.data.interviewer_name || '',
      };
      const application = await this._addInterviewUseCase.execute(interviewData);

      sendSuccessResponse(res, 'Interview added successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id, interviewId } = req.params;

      const dto = UpdateInterviewDto.safeParse({
        interview_id: interviewId,
        ...req.body,
      });
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const interviewData = {
        userId,
        applicationId: id,
        interviewId,
        date: dto.data.interview_date ? new Date(dto.data.interview_date) : undefined,
        time: dto.data.interview_time,
        interview_type: dto.data.interview_type,
        location: dto.data.location,
        interviewer_name: dto.data.interviewer_name,
        status: dto.data.status,
      };
      const application = await this._updateInterviewUseCase.execute(interviewData);

      sendSuccessResponse(res, 'Interview updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id, interviewId } = req.params;

      const application = await this._deleteInterviewUseCase.execute({ userId, applicationId: id, interviewId });

      sendSuccessResponse(res, 'Interview deleted successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addInterviewFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id, interviewId } = req.params;

      const dto = AddInterviewFeedbackDto.safeParse({
        interview_id: interviewId,
        ...req.body,
      });
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const feedbackData = {
        userId,
        applicationId: id,
        interviewId,
        reviewer_name: dto.data.reviewer_name,
        rating: dto.data.rating || 0,
        comment: dto.data.comment,
      };
      const application = await this._addInterviewFeedbackUseCase.execute(feedbackData);  

      sendSuccessResponse(res, 'Interview feedback added successfully', application);
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
}

