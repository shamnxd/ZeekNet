import { Request, Response, NextFunction } from 'express';
import { IGetAllJobPostingsUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { IGetJobPostingForPublicUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { handleError, success, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { JobPostingQueryRequestDto } from '../../../application/dto/job-posting/job-posting.dto';

export class PublicJobController {
  constructor(
    private readonly _getAllJobPostingsUseCase: IGetAllJobPostingsUseCase,
    private readonly _getJobPostingForPublicUseCase: IGetJobPostingForPublicUseCase,
  ) {}

  getAllJobPostings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as JobPostingQueryRequestDto;
      const result = await this._getAllJobPostingsUseCase.execute(filters);
      sendSuccessResponse(res, 'Job postings retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobPosting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobId = req.params.id;
      const result = await this._getJobPostingForPublicUseCase.execute(jobId);
      sendSuccessResponse(res, 'Job posting retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}