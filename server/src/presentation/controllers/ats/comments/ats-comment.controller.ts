import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCommentsByApplicationUseCase';
import { AddCommentRequestDtoSchema } from 'src/application/dtos/application/comments/requests/add-comment-request.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';

export class ATSCommentController {
  constructor(
    private readonly addCommentUseCase: IAddCommentUseCase,
    private readonly getCommentsByApplicationUseCase: IGetCommentsByApplicationUseCase,
  ) { }

  addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = AddCommentRequestDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const userId = validateUserId(req);

      const comment = await this.addCommentUseCase.execute({
        ...parsedBody.data,
        userId,
      });

      sendCreatedResponse(res, SUCCESS.CREATED('Comment'), comment);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCommentsByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const { stage } = req.query;
      const comments = await this.getCommentsByApplicationUseCase.execute({
        applicationId,
        stage: stage as string,
      });

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Comments'), comments);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

