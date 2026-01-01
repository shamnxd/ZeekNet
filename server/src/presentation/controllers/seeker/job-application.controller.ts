import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendNotFoundResponse,
  sendBadRequestResponse,
  validateUserId,
  badRequest,
} from '../../../shared/utils/controller.utils';
import { IGetSeekerApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/applications/IGetSeekerApplicationDetailsUseCase';
import { IGetApplicationsBySeekerUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsBySeekerUseCase';
import { ICreateJobApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/ICreateJobApplicationUseCase';
import { IAnalyzeResumeUseCase } from 'src/domain/interfaces/use-cases/applications/IAnalyzeResumeUseCase';
import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/IGetInterviewsByApplicationUseCase';
import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/IGetTechnicalTasksByApplicationUseCase';
import { ISubmitTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/applications/ISubmitTechnicalTaskUseCase';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/IGetOffersByApplicationUseCase';
import { IGetCompensationByApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/IGetCompensationByApplicationUseCase';
import { IGetCompensationMeetingsByApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/IGetCompensationMeetingsByApplicationUseCase';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateOfferStatusUseCase';
import { IUploadSignedOfferDocumentUseCase } from 'src/domain/interfaces/use-cases/applications/IUploadSignedOfferDocumentUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { UploadService } from '../../../shared/services/upload.service';
import { CreateJobApplicationDto } from '../../../application/dto/application/create-job-application.dto';
import { ApplicationFiltersDto } from '../../../application/dto/application/application-filters.dto';
import { ValidationError } from '../../../domain/errors/errors';

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
    private readonly _s3Service: IS3Service,
  ) {}

  createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!req.file) {
        return badRequest(res, 'Resume file is required');
      }

      const resumeUploadResult = await UploadService.handleResumeUpload(req, this._s3Service, 'resume');

      const { job_id, cover_letter } = req.body;

      if (!job_id) {
        return badRequest(res, 'Job ID is required');
      }
      const job = await this._jobPostingRepository.findById(job_id);
      if (!job) {
        return sendNotFoundResponse(res, 'Job posting not found');
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

      const application = await this._jobApplicationRepository.findById(id);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only view your own applications'), next);
      }

      const interviews = await this._interviewRepository.findByApplicationId(id);
      const interviewsForSeeker = interviews.map(interview => {
        const interviewObj = {
          id: interview.id,
          applicationId: interview.applicationId,
          title: interview.title,
          scheduledDate: interview.scheduledDate,
          type: interview.type,
          videoType: interview.videoType,
          webrtcRoomId: interview.webrtcRoomId,
          meetingLink: interview.meetingLink,
          location: interview.location,
          status: interview.status,
          createdAt: interview.createdAt,
          updatedAt: interview.updatedAt,
        };
        return interviewObj;
      });
      sendSuccessResponse(res, 'Interviews retrieved successfully', interviewsForSeeker);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getTechnicalTasksByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._jobApplicationRepository.findById(id);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only view your own applications'), next);
      }

      const tasks = await this._technicalTaskRepository.findByApplicationId(id);
      const tasksForSeeker = await Promise.all(
        tasks.map(async (task) => {
          const taskObj: Pick<ATSTechnicalTask, 'id' | 'applicationId' | 'title' | 'description' | 'deadline' | 'documentFilename' | 'submissionFilename' | 'submissionLink' | 'submissionNote' | 'submittedAt' | 'status' | 'createdAt' | 'updatedAt'> & { documentUrl?: string; submissionUrl?: string } = {
            id: task.id,
            applicationId: task.applicationId,
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            documentFilename: task.documentFilename,
            submissionFilename: task.submissionFilename,
            submissionLink: task.submissionLink,
            submissionNote: task.submissionNote,
            submittedAt: task.submittedAt,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          };
          
          if (task.documentUrl) {
            taskObj.documentUrl = await this._s3Service.getSignedUrl(task.documentUrl);
          }
          
          if (task.submissionUrl) {
            taskObj.submissionUrl = await this._s3Service.getSignedUrl(task.submissionUrl);
          }
          
          return taskObj;
        }),
      );
      sendSuccessResponse(res, 'Technical tasks retrieved successfully', tasksForSeeker);
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
        const uploadResult = await UploadService.handleTaskSubmissionUpload(req, this._s3Service, 'document');
        submissionUrl = uploadResult.url; 
        submissionFilename = uploadResult.filename;
      } else if (req.body.submissionUrl && req.body.submissionFilename) {
        submissionUrl = req.body.submissionUrl;
        submissionFilename = req.body.submissionFilename;
      }

      if (!submissionUrl && !submissionLink) {
        return sendBadRequestResponse(res, 'Please provide either a file upload or a submission link');
      }

      const application = await this._jobApplicationRepository.findById(applicationId);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only submit tasks for your own applications'), next);
      }

      const task = await this._technicalTaskRepository.findById(taskId);
      if (!task) {
        return sendNotFoundResponse(res, 'Technical task not found');
      }

      if (task.applicationId !== applicationId) {
        return handleAsyncError(new ValidationError('Task does not belong to this application'), next);
      }

      const updatedTask = await this._technicalTaskRepository.update(taskId, {
        submissionUrl,
        submissionFilename,
        submissionLink,
        submissionNote,
        status: 'submitted',
        submittedAt: new Date(),
      });

      if (!updatedTask) {
        return sendNotFoundResponse(res, 'Failed to update task');
      }

      let taskObj: Pick<ATSTechnicalTask, 'id' | 'applicationId' | 'title' | 'description' | 'deadline' | 'submissionLink' | 'submissionNote' | 'submittedAt' | 'status' | 'createdAt' | 'updatedAt'> & { documentUrl?: string; documentFilename?: string; submissionUrl?: string; submissionFilename?: string } = {
        id: updatedTask.id,
        applicationId: updatedTask.applicationId,
        title: updatedTask.title,
        description: updatedTask.description,
        deadline: updatedTask.deadline,
        submissionLink: updatedTask.submissionLink,
        submissionNote: updatedTask.submissionNote,
        submittedAt: updatedTask.submittedAt,
        status: updatedTask.status,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt,
      };

      if (updatedTask.documentUrl) {
        taskObj.documentUrl = await this._s3Service.getSignedUrl(updatedTask.documentUrl);
        taskObj.documentFilename = updatedTask.documentFilename;
      }

      if (updatedTask.submissionUrl) {
        taskObj.submissionUrl = await this._s3Service.getSignedUrl(updatedTask.submissionUrl);
        taskObj.submissionFilename = updatedTask.submissionFilename;
      }

      sendSuccessResponse(res, 'Task submitted successfully', taskObj);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getOffersByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._jobApplicationRepository.findById(id);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only view your own applications'), next);
      }

      const offers = await this._offerRepository.findByApplicationId(id);
      
      const offersWithSignedUrls = await Promise.all(
        offers.map(async (offer) => {
          try {
            const signedUrl = await this._s3Service.getSignedUrl(offer.documentUrl);
            const offerObj: ATSOffer & { documentUrl: string; signedDocumentUrl?: string } = {
              ...offer,
              documentUrl: signedUrl,
            };
            
            if (offer.signedDocumentUrl) {
              const signedDocUrl = await this._s3Service.getSignedUrl(offer.signedDocumentUrl);
              offerObj.signedDocumentUrl = signedDocUrl;
            }
            
            return offerObj;
          } catch (error) {
            console.error(`Error generating signed URL for offer ${offer.id}:`, error);
            return offer;
          }
        }),
      );
      
      sendSuccessResponse(res, 'Offers retrieved successfully', offersWithSignedUrls);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._jobApplicationRepository.findById(id);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only view your own applications'), next);
      }

      const compensation = await this._compensationRepository.findByApplicationId(id);
      sendSuccessResponse(res, 'Compensation retrieved successfully', compensation);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensationMeetings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._jobApplicationRepository.findById(id);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only view your own applications'), next);
      }

      const meetings = await this._compensationMeetingRepository.findByApplicationId(id);
      const meetingsForSeeker = meetings.map(meeting => {
        const meetingObj = {
          id: meeting.id,
          applicationId: meeting.applicationId,
          type: meeting.type,
          scheduledDate: meeting.scheduledDate,
          location: meeting.location,
          meetingLink: meeting.meetingLink,
          status: meeting.status,
          completedAt: meeting.completedAt,
          createdAt: meeting.createdAt,
          updatedAt: meeting.updatedAt,
        };
        return meetingObj;
      });
      sendSuccessResponse(res, 'Compensation meetings retrieved successfully', meetingsForSeeker);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateOfferStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { offerId } = req.params;
      const { status } = req.body;

      if (!status || !['signed', 'declined'].includes(status)) {
        return sendBadRequestResponse(res, 'Invalid status. Must be "signed" or "declined"');
      }

      const offer = await this._offerRepository.findById(offerId);
      if (!offer) {
        return sendNotFoundResponse(res, 'Offer not found');
      }

      const application = await this._jobApplicationRepository.findById(offer.applicationId);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only update offers for your own applications'), next);
      }

      const updateData: Partial<ATSOffer> & { status: 'signed' | 'declined'; signedAt?: Date; declinedAt?: Date } = {
        status,
      };

      if (status === 'signed') {
        updateData.signedAt = new Date();
      } else if (status === 'declined') {
        updateData.declinedAt = new Date();
      }

      const updatedOffer = await this._offerRepository.update(offerId, updateData);

      if (!updatedOffer) {
        return sendNotFoundResponse(res, 'Failed to update offer');
      }

      const documentSignedUrl = await this._s3Service.getSignedUrl(updatedOffer.documentUrl);
      let offerWithSignedUrl: ATSOffer & { documentUrl: string; signedDocumentUrl?: string } = {
        ...updatedOffer,
        documentUrl: documentSignedUrl,
      };

      if (updatedOffer.signedDocumentUrl) {
        const signedDocUrl = await this._s3Service.getSignedUrl(updatedOffer.signedDocumentUrl);
        offerWithSignedUrl.signedDocumentUrl = signedDocUrl;
      }

      sendSuccessResponse(res, `Offer ${status === 'signed' ? 'accepted' : 'declined'} successfully`, offerWithSignedUrl);
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

      const offer = await this._offerRepository.findById(offerId);
      if (!offer) {
        return sendNotFoundResponse(res, 'Offer not found');
      }

      const application = await this._jobApplicationRepository.findById(offer.applicationId);
      if (!application) {
        return sendNotFoundResponse(res, 'Application not found');
      }

      if (application.seekerId !== userId) {
        return handleAsyncError(new ValidationError('You can only upload signed documents for your own applications'), next);
      }

      const uploadResult = await UploadService.handleOfferLetterUpload(req, this._s3Service, 'document');

      const updatedOffer = await this._offerRepository.update(offerId, {
        signedDocumentUrl: uploadResult.url, 
        signedDocumentFilename: uploadResult.filename,
        status: 'signed',
        signedAt: new Date(),
      });

      if (!updatedOffer) {
        return sendNotFoundResponse(res, 'Failed to update offer');
      }

      if (application.stage === ATSStage.OFFER) {
        try {
          await this._updateApplicationSubStageUseCase.execute({
            applicationId: offer.applicationId,
            subStage: OfferSubStage.OFFER_ACCEPTED,
            performedBy: userId,
            performedByName: userName,
          });
        } catch (subStageError) {
          console.error('Error updating application substage:', subStageError);
        }
      }

      const documentSignedUrl = await this._s3Service.getSignedUrl(updatedOffer.documentUrl);
      const signedDocSignedUrl = await this._s3Service.getSignedUrl(updatedOffer.signedDocumentUrl!);

      const offerWithSignedUrl = {
        ...updatedOffer,
        documentUrl: documentSignedUrl,
        signedDocumentUrl: signedDocSignedUrl,
      };

      sendSuccessResponse(res, 'Signed document uploaded successfully', offerWithSignedUrl);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
};
