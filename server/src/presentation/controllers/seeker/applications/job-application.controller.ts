import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendNotFoundResponse,
  sendBadRequestResponse,
  validateUserId,
  badRequest,
} from 'src/shared/utils/presentation/controller.utils';
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
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
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
    private readonly _fileUploadService: IFileUploadService,
  ) { }

  createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!req.file) {
        return badRequest(res, 'Resume file is required');
      }

      const resumeUploadResult = await this._fileUploadService.uploadResume(req.file as unknown as UploadedFile, 'resume');

      const { job_id, cover_letter } = req.body;

      if (!job_id) {
        return badRequest(res, 'Job ID is required');
      }

      const dto = CreateJobApplicationDto.safeParse({
        job_id,
        cover_letter,
        resume_url: resumeUploadResult.url,
        resume_filename: resumeUploadResult.filename,
      });

      if (!dto.success) {
        return handleValidationError(
          `Validation error: ${dto.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const application = await this._createJobApplicationUseCase.execute(
        { seekerId: userId, ...dto.data },
        req.file.buffer,
        req.file.mimetype,
      );

      sendSuccessResponse(res, 'Application submitted successfully', { id: application.id }, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const filters = ApplicationFiltersDto.safeParse(req.query);
      if (!filters.success) {
        return handleValidationError(
          `Validation error: ${filters.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const result = await this._getApplicationsBySeekerUseCase.execute({
        seekerId: userId,
        stage: filters.data.stage,
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
      const { submissionLink, submissionNote } = req.body;

      let submissionUrl: string | undefined;
      let submissionFilename: string | undefined;

      if (req.file) {
        const uploadResult = await this._fileUploadService.uploadTaskSubmission(req.file as unknown as UploadedFile, 'document');
        submissionUrl = uploadResult.url;
        submissionFilename = uploadResult.filename;
      } else if (req.body.submissionUrl && req.body.submissionFilename) {
        submissionUrl = req.body.submissionUrl;
        submissionFilename = req.body.submissionFilename;
      }

      const result = await this._submitTechnicalTaskUseCase.execute(userId, applicationId, taskId, {
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

      const updatedOffer = await this._updateOfferStatusUseCase.execute(userId, offerId, status);

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

      const uploadResult = await this._fileUploadService.uploadOfferLetter(req.file as unknown as UploadedFile, 'document');

      const updatedOffer = await this._uploadSignedOfferDocumentUseCase.execute(userId, userName, offerId, {
        signedDocumentUrl: uploadResult.url,
        signedDocumentFilename: uploadResult.filename,
      });

      sendSuccessResponse(res, 'Signed document uploaded successfully', updatedOffer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


