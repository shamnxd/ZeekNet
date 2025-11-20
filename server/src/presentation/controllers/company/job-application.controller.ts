import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  sendNotFoundResponse,
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
import { ApplicationFiltersDto } from '../../../application/dto/job-application/application-filters.dto';
import { UpdateApplicationStageDto } from '../../../application/dto/job-application/update-application-stage.dto';
import { UpdateScoreDto } from '../../../application/dto/job-application/update-score.dto';
import { AddInterviewDto } from '../../../application/dto/job-application/add-interview.dto';
import { UpdateInterviewDto } from '../../../application/dto/job-application/update-interview.dto';
import { AddInterviewFeedbackDto } from '../../../application/dto/job-application/add-interview-feedback.dto';
import { JobApplicationMapper } from '../../../application/mappers/job-application.mapper';
import {
  JobApplicationListResponseDto,
  JobApplicationDetailResponseDto,
  PaginatedApplicationsResponseDto,
} from '../../../application/dto/job-application/job-application-response.dto';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

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
    private readonly _userRepository: IUserRepository,
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { job_id } = req.query;

      // Parse query parameters
      const filters = ApplicationFiltersDto.safeParse(req.query);
      if (!filters.success) {
        return handleValidationError(
          `Validation error: ${filters.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      let result;
      if (job_id) {
        result = await this._getApplicationsByJobUseCase.execute(userId, job_id as string, filters.data);
      } else {

        result = await this._getApplicationsByCompanyUseCase.execute(userId, filters.data);
      }

      const applications: JobApplicationListResponseDto[] = [];
      for (const app of result.applications) {
        const [user, job, profile] = await Promise.all([
          this._userRepository.findById(app.seekerId),
          this._jobPostingRepository.findById(app.jobId),
          this._seekerProfileRepository.findOne({ userId: app.seekerId }),
        ]);
        applications.push(
          JobApplicationMapper.toListDto(app, {
            seekerName: user?.name,
            seekerAvatar: profile?.avatarFileName ? this._s3Service.getImageUrl(profile.avatarFileName) : undefined,
            jobTitle: job?.title,
          }),
        );
      }

      const response: PaginatedApplicationsResponseDto = {
        applications,
        pagination: result.pagination,
      };

      sendSuccessResponse(res, 'Applications retrieved successfully', response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getApplicationDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id } = req.params;

      const application = await this._getApplicationDetailsUseCase.execute(userId, id);

      const [user, profile, job] = await Promise.all([
        this._userRepository.findById(application.seekerId),
        this._seekerProfileRepository.findOne({ userId: application.seekerId }),
        this._jobPostingRepository.findById(application.jobId),
      ]);

      let experiences: Array<{ title: string; company: string; startDate: Date; endDate?: Date; location?: string; description?: string; }> = [];
      let education: Array<{ school: string; degree?: string; startDate: Date; endDate?: Date; location?: string; }> = [];
      if (profile) {
        const [exps, edus] = await Promise.all([
          this._seekerExperienceRepository.findBySeekerProfileId(profile.id),
          this._seekerEducationRepository.findBySeekerProfileId(profile.id),
        ]);
        experiences = exps.map((e) => ({
          title: e.title,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate,
          location: e.location,
          description: e.description,
        }));
        education = edus.map((d) => ({
          school: d.school,
          degree: d.degree,
          startDate: d.startDate,
          endDate: d.endDate,
          location: undefined,
        }));
      }

      const response: JobApplicationDetailResponseDto = JobApplicationMapper.toDetailDto(
        application,
        {
          name: user?.name,
          avatar: profile?.avatarFileName ? this._s3Service.getImageUrl(profile.avatarFileName) : undefined,
          headline: profile?.headline || undefined,
          email: profile?.email || undefined,
          phone: profile?.phone || undefined,
          location: profile?.location || undefined,
          summary: profile?.summary || undefined,
          skills: profile?.skills || undefined,
          languages: profile?.languages || undefined,
          date_of_birth: profile?.dateOfBirth || undefined,
          gender: profile?.gender || undefined,
          experiences,
          education,
        },
        {
          title: job?.title,
          companyName: job?.companyName,
          location: job?.location,
          employmentTypes: job?.employmentTypes,
        },
      );

      console.log(response);

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
        dto.data.rejection_reason,
      );

      sendSuccessResponse(res, 'Application stage updated successfully', JobApplicationMapper.toListDto(application));
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

      sendSuccessResponse(res, 'Application score updated successfully', JobApplicationMapper.toListDto(application));
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

      const interviewData = JobApplicationMapper.interviewDataFromDto(dto.data);
      const application = await this._addInterviewUseCase.execute(userId, id, interviewData);

      sendSuccessResponse(res, 'Interview added successfully', JobApplicationMapper.toDetailDto(application));
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

      const interviewData = JobApplicationMapper.updateInterviewDataFromDto(dto.data);
      const application = await this._updateInterviewUseCase.execute(userId, id, interviewId, interviewData);

      sendSuccessResponse(res, 'Interview updated successfully', JobApplicationMapper.toDetailDto(application));
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { id, interviewId } = req.params;

      const application = await this._deleteInterviewUseCase.execute(userId, id, interviewId);

      sendSuccessResponse(res, 'Interview deleted successfully', JobApplicationMapper.toDetailDto(application));
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

      const feedbackData = JobApplicationMapper.feedbackDataFromDto(dto.data);
      const application = await this._addInterviewFeedbackUseCase.execute(userId, id, interviewId, feedbackData);

      sendSuccessResponse(res, 'Interview feedback added successfully', JobApplicationMapper.toDetailDto(application));
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

