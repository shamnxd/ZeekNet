import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { UpdateSubStageDtoSchema } from 'src/application/dtos/application/requests/update-sub-stage.dto';
import { IMoveApplicationStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IMoveApplicationStageUseCase';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IGetJobATSPipelineUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobATSPipelineUseCase';
import { IGetJobApplicationsForKanbanUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobApplicationsForKanbanUseCase';
import { MoveApplicationStageDtoSchema } from 'src/application/dtos/application/requests/move-application-stage.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class ATSPipelineController {
  constructor(
    @inject(TYPES.ATS_GetJobATSPipelineUseCase) private _getJobPipelineUseCase: IGetJobATSPipelineUseCase,
    @inject(TYPES.ATS_GetJobApplicationsForKanbanUseCase) private _getJobApplicationsForKanbanUseCase: IGetJobApplicationsForKanbanUseCase,
    @inject(TYPES.ATS_MoveApplicationStageUseCase) private _moveApplicationStageUseCase: IMoveApplicationStageUseCase,
    @inject(TYPES.UpdateApplicationSubStageUseCase) private _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
  ) { }

  getJobPipeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const pipeline = await this._getJobPipelineUseCase.execute({ jobId, userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Pipeline'), pipeline);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getJobApplicationsForKanban = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const applications = await this._getJobApplicationsForKanbanUseCase.execute({ jobId, userId });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Applications'), applications);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Application stage'), application);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Application sub-stage'), application);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
