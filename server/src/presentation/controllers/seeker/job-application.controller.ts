import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendNotFoundResponse,
  validateUserId,
  badRequest,
} from '../../../shared/utils/controller.utils';
import { IGetSeekerApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/applications/IGetSeekerApplicationDetailsUseCase';
import { IGetApplicationsBySeekerUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsBySeekerUseCase';
import { ICreateJobApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/ICreateJobApplicationUseCase';
import { IAnalyzeResumeUseCase } from 'src/domain/interfaces/use-cases/applications/IAnalyzeResumeUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { UploadService } from '../../../shared/services/upload.service';
import { CreateJobApplicationDto } from '../../../application/dto/application/create-job-application.dto';
import { ApplicationFiltersDto } from '../../../application/dto/application/application-filters.dto';

export class SeekerJobApplicationController {
  constructor(
    private readonly _createJobApplicationUseCase: ICreateJobApplicationUseCase,
    private readonly _getApplicationsBySeekerUseCase: IGetApplicationsBySeekerUseCase,

    private readonly _getApplicationDetailsUseCase: IGetSeekerApplicationDetailsUseCase,
    private readonly _analyzeResumeUseCase: IAnalyzeResumeUseCase,
    private readonly _s3Service: IS3Service,
    private readonly _jobPostingRepository: IJobPostingRepository,
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
      const userId = validateUserId(req); // Ensure user is logged in

      if (!req.file) {
        return badRequest(res, 'Resume file is required');
      }

      const { job_id } = req.body;
      if (!job_id) {
        return badRequest(res, 'Job ID is required');
      }
      
      // Ensure file exists in memory (assuming memory storage)
      if (!req.file.buffer) {
        // Fallback if s3 storage was used by mistake
        return badRequest(res, 'File processing error');
      }

      const result = await this._analyzeResumeUseCase.execute(job_id, req.file.buffer, req.file.mimetype);

      sendSuccessResponse(res, 'Resume analyzed successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
};

