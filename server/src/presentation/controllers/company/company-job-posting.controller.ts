import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { success, handleError, handleValidationError, handleAsyncError, sendSuccessResponse, validateUserId } from '../../../shared/utils/controller.utils';
import { ICreateJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IGetJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IGetCompanyJobPostingsUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IUpdateJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IDeleteJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IIncrementJobViewCountUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { IUpdateJobStatusUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CreateJobPostingRequestDto, UpdateJobPostingRequestDto, JobPostingQueryRequestDto, UpdateJobPostingDto } from '../../../application/dto/job-posting/job-posting.dto';
import { IGetCompanyJobPostingUseCase, IGetCompanyProfileByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

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
    const parsed = CreateJobPostingRequestDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(`Invalid job posting data: ${parsed.error.errors.map((e: { path: (string | number)[]; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const userId = validateUserId(req);
      const jobPosting = await this._createJobPostingUseCase.execute(userId, parsed.data);
      sendSuccessResponse(res, 'Job posting created successfully', jobPosting, undefined, 201);
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
      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const query = req.query as unknown as JobPostingQueryRequestDto;
      const result = await this._getCompanyJobPostingsUseCase.execute(companyProfile.id, query);

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

      const jobPosting = await this._updateJobPostingUseCase.execute(id, parsed.data);

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
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      return handleValidationError('is_active must be a boolean value', next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const jobPosting = await this._updateJobStatusUseCase.execute(id, is_active);

      sendSuccessResponse(res, 'Job status updated successfully', jobPosting);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}