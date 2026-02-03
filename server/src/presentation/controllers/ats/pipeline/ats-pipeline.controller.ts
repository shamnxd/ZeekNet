import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IMoveApplicationStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IMoveApplicationStageUseCase';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IGetJobATSPipelineUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobATSPipelineUseCase';
import { IGetJobApplicationsForKanbanUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobApplicationsForKanbanUseCase';
import { sendSuccessResponse, handleAsyncError, handleValidationError, validateUserId } from 'src/shared/utils/presentation/controller.utils';
import { MoveApplicationStageDtoSchema } from 'src/application/dtos/application/requests/move-application-stage.dto';
import { UpdateSubStageDtoSchema } from 'src/application/dtos/application/requests/update-sub-stage.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class ATSPipelineController {
  constructor(
    private _getJobPipelineUseCase: IGetJobATSPipelineUseCase,
    private _getJobApplicationsForKanbanUseCase: IGetJobApplicationsForKanbanUseCase,
    private _moveApplicationStageUseCase: IMoveApplicationStageUseCase,
    private _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
  ) { }

  getJobPipeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const pipeline = await this._getJobPipelineUseCase.execute({ jobId, userId });
      sendSuccessResponse(res, 'Pipeline retrieved successfully', pipeline);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobApplicationsForKanban = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const applications = await this._getJobApplicationsForKanbanUseCase.execute({ jobId, userId });
      sendSuccessResponse(res, 'Applications retrieved successfully', applications);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  moveApplicationStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = MoveApplicationStageDtoSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(formatZodErrors(validationResult.error), next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const userName = req.user?.email || 'Unknown User';

      const application = await this._moveApplicationStageUseCase.execute({
        applicationId: id,
        userId,
        userName,
        ...validationResult.data,
      });

      sendSuccessResponse(res, 'Application stage moved successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateApplicationSubStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validationResult = UpdateSubStageDtoSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(formatZodErrors(validationResult.error), next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);
      const userName = req.user?.email || 'Unknown User';

      const application = await this._updateApplicationSubStageUseCase.execute({
        applicationId: id,
        userId,
        userName,
        ...validationResult.data,
      });

      sendSuccessResponse(res, 'Application sub-stage updated successfully', application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



