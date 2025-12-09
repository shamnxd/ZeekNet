import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from '../../../shared/utils/controller.utils';
import {
  IGetApplicationsByJobUseCase,
  IGetApplicationsByCompanyUseCase,
  IGetApplicationDetailsUseCase,
  IUpdateApplicationStageUseCase,
  IUpdateApplicationScoreUseCase,
  IAddInterviewUseCase,
  IUpdateInterviewUseCase,
  IDeleteInterviewUseCase,
  IAddInterviewFeedbackUseCase,
} from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { ApplicationFiltersDto } from '../../../application/dto/application/application-filters.dto';
import { UpdateApplicationStageDto } from '../../../application/dto/application/update-application-stage.dto';
import { UpdateScoreDto } from '../../../application/dto/application/update-score.dto';
import { AddInterviewDto } from '../../../application/dto/application/add-interview.dto';
import { UpdateInterviewDto } from '../../../application/dto/application/update-interview.dto';
import { AddInterviewFeedbackDto } from '../../../application/dto/application/add-interview-feedback.dto';
import { AddInterviewData } from '../../../domain/interfaces/use-cases/interview/AddInterviewData';
import { UpdateInterviewData } from '../../../domain/interfaces/use-cases/interview/UpdateInterviewData';
import { AddInterviewFeedbackData } from '../../../domain/interfaces/use-cases/interview/AddInterviewFeedbackData';

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

      const dto = UpdateApplicationStageDto.safeParse(req.body);
      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const application = await this._updateApplicationStageUseCase.execute(
        userId,
        id,
        dto.data.stage,
        dto.data.rejectionReason,
      );

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

      const application = await this._updateApplicationScoreUseCase.execute(userId, id, dto.data.score);

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

      const interviewData: AddInterviewData = {
        userId,
        applicationId: id,
        date: new Date(dto.data.interview_date),
        time: dto.data.interview_time,
        interview_type: dto.data.interview_type,
        location: dto.data.location || '',
        interviewer_name: dto.data.interviewer_name,
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

      const interviewData: UpdateInterviewData = {
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

      const application = await this._deleteInterviewUseCase.execute(userId, id, interviewId);

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

      const feedbackData: AddInterviewFeedbackData = {
        userId,
        applicationId: id,
        interviewId,
        reviewer_name: dto.data.reviewer_name,
        rating: dto.data.rating,
        comment: dto.data.comment,
      };
      const application = await this._addInterviewFeedbackUseCase.execute(feedbackData);  

      sendSuccessResponse(res, 'Interview feedback added successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

