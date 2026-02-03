import { NextFunction, Response } from 'express';
import { IGetApplicationActivitiesUseCase } from 'src/domain/interfaces/use-cases/application/activity/IGetApplicationActivitiesUseCase';
import { GetActivitiesQueryDtoSchema } from 'src/application/dtos/application/activity/requests/get-activities-query.dto';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class ATSActivityController {
  constructor(
    private readonly getApplicationActivitiesUseCase: IGetApplicationActivitiesUseCase,
  ) { }

  getActivitiesByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedQuery = GetActivitiesQueryDtoSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return handleValidationError(formatZodErrors(parsedQuery.error), next);
    }

    try {
      const { id } = req.params;
      const result = await this.getApplicationActivitiesUseCase.execute({
        applicationId: id,
        ...parsedQuery.data,
      });

      sendSuccessResponse(res, 'Activities retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

