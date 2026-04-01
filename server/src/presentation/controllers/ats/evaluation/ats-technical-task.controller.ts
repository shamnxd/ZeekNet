import { Response, NextFunction } from 'express';
import { UploadedFile } from 'src/domain/types/common.types';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { AssignTechnicalTaskSchema } from 'src/application/dtos/application/task/requests/assign-technical-task.dto';
import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';
import { UpdateTechnicalTaskSchema } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';

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

      sendCreatedResponse(res, SUCCESS.CREATED('Technical task'), task);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Technical task'), task);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getTechnicalTasksByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const tasks = await this._getTechnicalTasksByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Technical tasks'), tasks);
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

      sendSuccessResponse(res, SUCCESS.DELETED('Technical task'), { id });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}




