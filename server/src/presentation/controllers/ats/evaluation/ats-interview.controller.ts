import { Response, NextFunction } from 'express';

import { IScheduleInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IScheduleInterviewUseCase';
import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IUpdateInterviewUseCase';
import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/interview/IGetInterviewsByApplicationUseCase';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendSuccessResponse, sendCreatedResponse, validateUserId, handleValidationError, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { HttpStatus } from 'src/domain/enums/http-status.enum';
import { ScheduleInterviewDtoSchema } from 'src/application/dtos/application/interview/requests/schedule-interview.dto';
import { UpdateInterviewDtoSchema } from 'src/application/dtos/application/interview/requests/update-interview.dto';

export class ATSInterviewController {
  constructor(
    private scheduleInterviewUseCase: IScheduleInterviewUseCase,
    private updateInterviewUseCase: IUpdateInterviewUseCase,
    private getInterviewsByApplicationUseCase: IGetInterviewsByApplicationUseCase,
  ) { }

  scheduleInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = ScheduleInterviewDtoSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const userId = validateUserId(req);

      const interview = await this.scheduleInterviewUseCase.execute({
        ...validation.data,
        userId,
      });

      sendCreatedResponse(res, 'Interview scheduled successfully', interview);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UpdateInterviewDtoSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);

      const interview = await this.updateInterviewUseCase.execute({
        ...validation.data,
        interviewId: id,
        userId,
      });

      sendSuccessResponse(res, 'Interview updated successfully', interview);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getInterviewsByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const interviews = await this.getInterviewsByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Interviews retrieved successfully', interviews);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
