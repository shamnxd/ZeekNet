import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { IMoveApplicationStageUseCase } from '../../../domain/interfaces/use-cases/ats/IMoveApplicationStageUseCase';
import { IUpdateApplicationSubStageUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateApplicationSubStageUseCase';
import { IGetJobATSPipelineUseCase } from '../../../domain/interfaces/use-cases/ats/IGetJobATSPipelineUseCase';
import { IGetJobApplicationsForKanbanUseCase } from '../../../domain/interfaces/use-cases/ats/IGetJobApplicationsForKanbanUseCase';
import { IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyIdByUserIdUseCase';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendInternalServerErrorResponse } from '../../../shared/utils/presentation/controller.utils';
import { MoveApplicationStageDto, MoveApplicationStageDtoSchema } from '../../../application/dtos/ats/common/move-application-stage.dto';
import { UpdateSubStageDto, UpdateSubStageDtoSchema } from '../../../application/dtos/ats/requests/update-sub-stage.dto';
import { ATSStage, ATSSubStage } from '../../../domain/enums/ats-stage.enum';
import { validateUserId } from '../../../shared/utils/presentation/controller.utils';

export class ATSPipelineController {
  constructor(
    private getJobPipelineUseCase: IGetJobATSPipelineUseCase,
    private getJobApplicationsForKanbanUseCase: IGetJobApplicationsForKanbanUseCase,
    private moveApplicationStageUseCase: IMoveApplicationStageUseCase,
    private updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  getJobPipeline = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const userId = validateUserId(req);
      const companyId = await this.getCompanyIdByUserIdUseCase.execute(userId);

      const pipeline = await this.getJobPipelineUseCase.execute(jobId, companyId);
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
      const companyId = await this.getCompanyIdByUserIdUseCase.execute(userId);

      const applications = await this.getJobApplicationsForKanbanUseCase.execute(jobId, companyId);
      sendSuccessResponse(res, 'Applications retrieved successfully', applications);
    } catch (error) {
      console.error('Error fetching applications for kanban:', error);
      sendInternalServerErrorResponse(res, error instanceof Error ? error.message : 'Failed to fetch applications');
    }
  };

  moveApplicationStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      // Validate DTO
      const validationResult = MoveApplicationStageDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        sendBadRequestResponse(res, `Validation error: ${validationResult.error.message}`);
        return;
      }

      const dto: MoveApplicationStageDto = validationResult.data;

      const application = await this.moveApplicationStageUseCase.execute({
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
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      // Validate DTO
      const validationResult = UpdateSubStageDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        sendBadRequestResponse(res, `Validation error: ${validationResult.error.message}`);
        return;
      }

      const dto: UpdateSubStageDto = validationResult.data;

      const application = await this.updateApplicationSubStageUseCase.execute({
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



