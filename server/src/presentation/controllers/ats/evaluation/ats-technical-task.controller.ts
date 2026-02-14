import { Response, NextFunction } from 'express';

import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendSuccessResponse, sendCreatedResponse, validateUserId, handleValidationError, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { AssignTechnicalTaskSchema } from 'src/application/dtos/application/task/requests/assign-technical-task.dto';
import { UpdateTechnicalTaskSchema } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { UploadedFile } from 'src/domain/types/common.types';

export class ATSTechnicalTaskController {
  constructor(
    private readonly _assignTechnicalTaskUseCase: IAssignTechnicalTaskUseCase,
    private readonly _updateTechnicalTaskUseCase: IUpdateTechnicalTaskUseCase,
    private readonly _deleteTechnicalTaskUseCase: IDeleteTechnicalTaskUseCase,
    private readonly _getTechnicalTasksByApplicationUseCase: IGetTechnicalTasksByApplicationUseCase,
  ) { }

  assignTechnicalTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = AssignTechnicalTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const userId = validateUserId(req);

      const applicationId = req.params.applicationId ||
        (req.body as Record<string, unknown>).applicationId as string;

      const task = await this._assignTechnicalTaskUseCase.execute({
        ...validation.data,
        applicationId,
        performedBy: userId,
      }, req.file as unknown as UploadedFile);

      sendCreatedResponse(res, 'Technical task assigned successfully', task);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateTechnicalTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UpdateTechnicalTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);

      const task = await this._updateTechnicalTaskUseCase.execute({
        taskId: id,
        ...validation.data,
        performedBy: userId,
      }, req.file as unknown as UploadedFile);

      sendSuccessResponse(res, 'Technical task updated successfully', task);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getTechnicalTasksByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const tasks = await this._getTechnicalTasksByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Technical tasks retrieved successfully', tasks);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteTechnicalTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = validateUserId(req);

      await this._deleteTechnicalTaskUseCase.execute({
        taskId: id,
        performedBy: userId,
        performedByName: 'Unknown', // TODO: ADD performedByName 
      });

      sendSuccessResponse(res, 'Technical task deleted successfully', { id });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



