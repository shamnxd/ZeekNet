import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { IAddCommentUseCase } from '../../../domain/interfaces/use-cases/ats/IAddCommentUseCase';
import { IGetCommentsByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetCommentsByApplicationUseCase';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendInternalServerErrorResponse } from '../../../shared/utils/controller.utils';
import { AddCommentDto } from '../../../application/dto/ats/add-comment.dto';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';

export class ATSCommentController {
  constructor(
    private addCommentUseCase: IAddCommentUseCase,
    private getCommentsByApplicationUseCase: IGetCommentsByApplicationUseCase,
  ) {}

  addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: AddCommentDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const comment = await this.addCommentUseCase.execute({
        applicationId: dto.applicationId,
        comment: dto.comment,
        stage: dto.stage,
        subStage: dto.subStage,
        addedBy: userId,
        addedByName: userName,
      });

      sendCreatedResponse(res, 'Comment added successfully', comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      sendInternalServerErrorResponse(res, 'Failed to add comment');
    }
  };

  getCommentsByApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const comments = await this.getCommentsByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Comments retrieved successfully', comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch comments');
    }
  };

  addCompensationNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const { note } = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const comment = await this.addCommentUseCase.execute({
        applicationId,
        comment: note,
        stage: ATSStage.COMPENSATION,
        addedBy: userId,
        addedByName: userName,
      });

      sendCreatedResponse(res, 'Compensation note added successfully', comment);
    } catch (error) {
      console.error('Error adding compensation note:', error);
      sendInternalServerErrorResponse(res, 'Failed to add compensation note');
    }
  };

  getCompensationNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const comments = await this.getCommentsByApplicationUseCase.execute(applicationId);
      const compensationNotes = comments.filter(c => c.stage === ATSStage.COMPENSATION);

      sendSuccessResponse(res, 'Compensation notes retrieved successfully', compensationNotes);
    } catch (error) {
      console.error('Error fetching compensation notes:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch compensation notes');
    }
  };
}

