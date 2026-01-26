import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendCreatedResponse,
  sendNotFoundResponse,
  sendBadRequestResponse,
  validateUserId,
  badRequest,
} from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { IGetSeekerApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetSeekerApplicationDetailsUseCase';
import { IGetApplicationsBySeekerUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetApplicationsBySeekerUseCase';
import { ICreateJobApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/ICreateJobApplicationUseCase';
import { IAnalyzeResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/score-checker/IAnalyzeResumeUseCase';
import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetInterviewsByApplicationUseCase';
import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetTechnicalTasksByApplicationUseCase';
import { ISubmitTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/ISubmitTechnicalTaskUseCase';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetOffersByApplicationUseCase';
import { IGetCompensationByApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetCompensationByApplicationUseCase';
import { IGetCompensationMeetingsByApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetCompensationMeetingsByApplicationUseCase';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IUpdateOfferStatusUseCase';
import { IUploadSignedOfferDocumentUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IUploadSignedOfferDocumentUseCase';
import { UploadedFile } from 'src/domain/types/common.types';
import { CreateJobApplicationDto } from 'src/application/dtos/seeker/applications/requests/create-job-application.dto';
import { ApplicationFiltersDto } from 'src/application/dtos/company/hiring/requests/application-filters.dto';
import { ValidationError } from 'src/domain/errors/errors';

export class SeekerJobApplicationController {
  constructor(
    private readonly _createJobApplicationUseCase: ICreateJobApplicationUseCase,
    private readonly _getApplicationsBySeekerUseCase: IGetApplicationsBySeekerUseCase,
    private readonly _getApplicationDetailsUseCase: IGetSeekerApplicationDetailsUseCase,
    private readonly _analyzeResumeUseCase: IAnalyzeResumeUseCase,
    private readonly _getInterviewsByApplicationUseCase: IGetInterviewsByApplicationUseCase,
    private readonly _getTechnicalTasksByApplicationUseCase: IGetTechnicalTasksByApplicationUseCase,
    private readonly _submitTechnicalTaskUseCase: ISubmitTechnicalTaskUseCase,
    private readonly _getOffersByApplicationUseCase: IGetOffersByApplicationUseCase,
    private readonly _getCompensationByApplicationUseCase: IGetCompensationByApplicationUseCase,
    private readonly _getCompensationMeetingsByApplicationUseCase: IGetCompensationMeetingsByApplicationUseCase,
    private readonly _updateOfferStatusUseCase: IUpdateOfferStatusUseCase,
    private readonly _uploadSignedOfferDocumentUseCase: IUploadSignedOfferDocumentUseCase,
  ) { }

  createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateJobApplicationDto.omit({ resume_url: true, resume_filename: true });
      const parsedBody = bodySchema.safeParse(req.body);

      if (!parsedBody.success) {
        return handleValidationError(formatZodErrors(parsedBody.error), next);
      }

      const application = await this._createJobApplicationUseCase.execute(
        { seekerId: userId, ...parsedBody.data },
        req.file as unknown as UploadedFile,
      );

      sendCreatedResponse(res, 'Application submitted successfully', { id: application.id });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const filters = ApplicationFiltersDto.safeParse(req.query);
      if (!filters.success) {
        return handleValidationError(formatZodErrors(filters.error), next);
      }

      const result = await this._getApplicationsBySeekerUseCase.execute({
        seekerId: userId,
        stage: filters.data.stage,
        search: filters.data.search,
        page: filters.data.page,
        limit: filters.data.limit,
      });

      sendSuccessResponse(res, 'Applications retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplicationDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const response = await this._getApplicationDetailsUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Application details retrieved successfully', response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  analyzeResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!req.file) {
        return badRequest(res, 'Resume file is required');
      }

      const { job_id } = req.body;
      if (!job_id) {
        return badRequest(res, 'Job ID is required');
      }


      if (!req.file.buffer) {

        return badRequest(res, 'File processing error');
      }

      const result = await this._analyzeResumeUseCase.execute(job_id, req.file.buffer, req.file.mimetype);

      sendSuccessResponse(res, 'Resume analyzed successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getInterviewsByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const interviews = await this._getInterviewsByApplicationUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Interviews retrieved successfully', interviews);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getTechnicalTasksByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const tasks = await this._getTechnicalTasksByApplicationUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Technical tasks retrieved successfully', tasks);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  submitTechnicalTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { applicationId, taskId } = req.params;
      const { submissionLink, submissionNote, submissionUrl, submissionFilename } = req.body;

      const result = await this._submitTechnicalTaskUseCase.execute(userId, applicationId, taskId, {
        file: req.file as unknown as UploadedFile,
        submissionUrl,
        submissionFilename,
        submissionLink,
        submissionNote,
      });

      sendSuccessResponse(res, 'Task submitted successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getOffersByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const offers = await this._getOffersByApplicationUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Offers retrieved successfully', offers);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const compensation = await this._getCompensationByApplicationUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Compensation retrieved successfully', compensation);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensationMeetings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const meetings = await this._getCompensationMeetingsByApplicationUseCase.execute(userId, id);

      sendSuccessResponse(res, 'Compensation meetings retrieved successfully', meetings);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateOfferStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { offerId } = req.params;
      const { status } = req.body;

      const updatedOffer = await this._updateOfferStatusUseCase.execute({
        performedBy: userId,
        performedByName: req.user?.email || 'Unknown User',
        offerId,
        status: status as 'signed' | 'declined',
      });

      sendSuccessResponse(res, `Offer ${status === 'signed' ? 'accepted' : 'declined'} successfully`, updatedOffer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadSignedOfferDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const userName = req.user?.email || 'Unknown User';
      const { offerId } = req.params;

      if (!req.file) {
        return sendBadRequestResponse(res, 'Signed document file is required');
      }

      const updatedOffer = await this._uploadSignedOfferDocumentUseCase.execute(userId, userName, offerId, {
        file: req.file as unknown as UploadedFile,
      });

      sendSuccessResponse(res, 'Signed document uploaded successfully', updatedOffer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
