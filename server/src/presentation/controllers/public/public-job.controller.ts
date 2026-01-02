import { Request, Response, NextFunction } from 'express';
import { IGetAllJobPostingsUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetAllJobPostingsUseCase';
import { IGetJobPostingForPublicUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetJobPostingForPublicUseCase';
import { handleError, success, handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { JobPostingQueryRequestDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';

export class PublicJobController {
  constructor(
    private readonly _getAllJobPostingsUseCase: IGetAllJobPostingsUseCase,
    private readonly _getJobPostingForPublicUseCase: IGetJobPostingForPublicUseCase,
  ) {}

  getAllJobPostings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as JobPostingQueryRequestDto;

      const filters = {
        categoryIds: query.category_ids,
        employmentTypes: query.employment_types,
        salaryMin: query.salary_min,
        salaryMax: query.salary_max,
        location: query.location,
        search: query.search,
        page: query.page,
        limit: query.limit,
      };
      
      const result = await this._getAllJobPostingsUseCase.execute(filters);
      sendSuccessResponse(res, 'Job postings retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobPosting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobId = req.params.id;

      const userId = (req as Request & { user?: { id: string } }).user?.id;
      const result = await this._getJobPostingForPublicUseCase.execute(jobId, userId);
      sendSuccessResponse(res, 'Job posting retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


