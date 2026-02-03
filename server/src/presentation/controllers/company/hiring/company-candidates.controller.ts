import { Request, Response, NextFunction } from 'express';
import { GetCandidatesDto } from 'src/application/dtos/company/hiring/requests/get-candidates.dto';
import { GetCandidateDetailsDto } from 'src/application/dtos/company/hiring/requests/get-candidate-details.dto';
import { IGetCandidatesUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetCandidatesUseCase';
import { IGetCandidateDetailsUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetCandidateDetailsUseCase';
import { handleAsyncError, sendSuccessResponse, handleValidationError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class CompanyCandidatesController {
  constructor(
    private readonly _getCandidatesUseCase: IGetCandidatesUseCase,
    private readonly _getCandidateDetailsUseCase: IGetCandidateDetailsUseCase,
  ) { }

  getCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetCandidatesDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getCandidatesUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Candidates retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCandidateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetCandidateDetailsDto.safeParse(req.params);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getCandidateDetailsUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Candidate details retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


