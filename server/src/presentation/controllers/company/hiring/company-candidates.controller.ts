import { Request, Response, NextFunction } from 'express';
import { handleAsyncError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { IGetCandidatesUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetCandidatesUseCase';
import { IGetCandidateDetailsUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetCandidateDetailsUseCase';

export class CompanyCandidatesController {
  constructor(
    private readonly _getCandidatesUseCase: IGetCandidatesUseCase,
    private readonly _getCandidateDetailsUseCase: IGetCandidateDetailsUseCase,
  ) {}

  getCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const location = req.query.location as string;
      const skills = req.query.skills ? (req.query.skills as string).split(',') : undefined;

      const result = await this._getCandidatesUseCase.execute({
        page,
        limit,
        search,
        location,
        skills,
      });

      sendSuccessResponse(res, 'Candidates retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCandidateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._getCandidateDetailsUseCase.execute(id);
      sendSuccessResponse(res, 'Candidate details retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

