import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IMoveApplicationStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IMoveApplicationStageUseCase';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IGetJobATSPipelineUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobATSPipelineUseCase';
import { IGetJobApplicationsForKanbanUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobApplicationsForKanbanUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendInternalServerErrorResponse, extractUserId } from 'src/shared/utils/presentation/controller.utils';
import { MoveApplicationStageDto, MoveApplicationStageDtoSchema } from 'src/application/dtos/application/requests/move-application-stage.dto';
import { UpdateSubStageDto, UpdateSubStageDtoSchema } from 'src/application/dtos/application/requests/update-sub-stage.dto';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';
import { validateUserId } from 'src/shared/utils/presentation/controller.utils';

export class ATSPipelineController {
  constructor(
    private _getJobPipelineUseCase: IGetJobATSPipelineUseCase,
    private _getJobApplicationsForKanbanUseCase: IGetJobApplicationsForKanbanUseCase,
    private _moveApplicationStageUseCase: IMoveApplicationStageUseCase,
    private _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) { }

  getJobPipeline = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const pipeline = await this._getJobPipelineUseCase.execute(jobId, companyId);
      sendSuccessResponse(res, 'Pipeline retrieved successfully', pipeline);
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      sendInternalServerErrorResponse(res, error instanceof Error ? error.message : 'Failed to fetch pipeline');
    }
  };

  getJobApplicationsForKanban = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const companyId = await this._getCompanyIdByUserIdUseCase.execute(userId);

      const applications = await this._getJobApplicationsForKanbanUseCase.execute(jobId, companyId);
      sendSuccessResponse(res, 'Applications retrieved successfully', applications);
    } catch (error) {
      console.error('Error fetching applications for kanban:', error);
      sendInternalServerErrorResponse(res, error instanceof Error ? error.message : 'Failed to fetch applications');
    }
  };

  moveApplicationStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }


      const validationResult = MoveApplicationStageDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        sendBadRequestResponse(res, `Validation error: ${validationResult.error.message}`);
        return;
      }

      const dto: MoveApplicationStageDto = validationResult.data;

      const application = await this._moveApplicationStageUseCase.execute({
        applicationId: id,
        nextStage: dto.nextStage as ATSStage,
        subStage: dto.subStage as ATSSubStage | undefined,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Application stage moved successfully', application);
    } catch (error) {
      console.error('Error moving application stage:', error);
      sendInternalServerErrorResponse(res, error instanceof Error ? error.message : 'Failed to move application stage');
    }
  };

  updateApplicationSubStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }


      const validationResult = UpdateSubStageDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        sendBadRequestResponse(res, `Validation error: ${validationResult.error.message}`);
        return;
      }

      const dto: UpdateSubStageDto = validationResult.data;

      const application = await this._updateApplicationSubStageUseCase.execute({
        applicationId: id,
        subStage: dto.subStage as ATSSubStage,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Application sub-stage updated successfully', application);
    } catch (error) {
      console.error('Error updating application sub-stage:', error);
      sendInternalServerErrorResponse(res, error instanceof Error ? error.message : 'Failed to update application sub-stage');
    }
  };
}



