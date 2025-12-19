import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { success, handleError, handleValidationError, handleAsyncError, sendSuccessResponse, validateUserId } from '../../../shared/utils/controller.utils';
import { ICreateJobPostingUseCase } from '../../../domain/interfaces/use-cases/jobs/ICreateJobPostingUseCase';
import { IGetJobPostingUseCase } from '../../../domain/interfaces/use-cases/jobs/IGetJobPostingUseCase';
import { IGetCompanyJobPostingsUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyJobPostingsUseCase';
import { IUpdateJobPostingUseCase } from '../../../domain/interfaces/use-cases/jobs/IUpdateJobPostingUseCase';
import { IDeleteJobPostingUseCase } from '../../../domain/interfaces/use-cases/jobs/IDeleteJobPostingUseCase';
import { IIncrementJobViewCountUseCase } from '../../../domain/interfaces/use-cases/jobs/IIncrementJobViewCountUseCase';
import { CreateJobPostingRequestDto, JobPostingQueryRequestDto, UpdateJobPostingDto } from '../../../application/dto/job-posting/job-posting.dto';
import { CreateJobPostingRequestDtoSchema } from '../../../application/dto/job-posting/create-job-posting-request.dto';
import { IGetCompanyJobPostingUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyJobPostingUseCase';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/IGetCompanyProfileByUserIdUseCase';
import { IUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/jobs/IUpdateJobStatusUseCase';
import { HttpStatus } from '../../../domain/enums/http-status.enum';

export class CompanyJobPostingController {
  constructor(
    private readonly _createJobPostingUseCase: ICreateJobPostingUseCase,
    private readonly _getJobPostingUseCase: IGetJobPostingUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
    private readonly _updateJobPostingUseCase: IUpdateJobPostingUseCase,
    private readonly _deleteJobPostingUseCase: IDeleteJobPostingUseCase,
    private readonly _incrementJobViewCountUseCase: IIncrementJobViewCountUseCase,
    private readonly _updateJobStatusUseCase: IUpdateJobStatusUseCase,
    private readonly _getCompanyJobPostingUseCase: IGetCompanyJobPostingUseCase,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
  ) {}

  createJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateJobPostingRequestDtoSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid job posting data: ${parsed.error.errors.map((e: { path: (string | number)[]; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const jobPosting = await this._createJobPostingUseCase.execute({ userId, ...parsed.data });
      sendSuccessResponse(res, 'Job posting created successfully', jobPosting, undefined, HttpStatus.CREATED);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const userRole = req.user?.role || '';

      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const jobPosting = await this._getCompanyJobPostingUseCase.execute(id, companyProfile.id);

      this._incrementJobViewCountUseCase.execute(id, userRole).catch(console.error);

      sendSuccessResponse(res, 'Job posting retrieved successfully', jobPosting);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompanyJobPostings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const query = req.query as unknown as JobPostingQueryRequestDto;
      const result = await this._getCompanyJobPostingsUseCase.execute({ userId, ...query });

      sendSuccessResponse(res, 'Company job postings retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UpdateJobPostingDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid job posting data: ${parsed.error.errors.map((e: { path: (string | number)[]; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const jobPosting = await this._updateJobPostingUseCase.execute({ jobId: id, ...parsed.data });

      sendSuccessResponse(res, 'Job posting updated successfully', jobPosting);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      await this._deleteJobPostingUseCase.execute(id, companyProfile.id);

      sendSuccessResponse(res, 'Job posting deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateJobStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { status } = req.body;
    const validStatuses = ['active', 'unlisted', 'expired'];
    if (!status || !validStatuses.includes(status)) {
      return handleValidationError('status must be one of: active, unlisted, expired', next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const jobPosting = await this._updateJobStatusUseCase.execute({ jobId: id, status, userId });

      sendSuccessResponse(res, `Job status updated to '${status}' successfully`, jobPosting);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}