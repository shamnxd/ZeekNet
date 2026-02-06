import { NextFunction, Response } from 'express';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCommentsByApplicationUseCase';
import { AddCommentRequestDtoSchema } from 'src/application/dtos/application/comments/requests/add-comment-request.dto';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse, validateUserId } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

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

      sendCreatedResponse(res, 'Comment added successfully', comment);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCommentsByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const comments = await this.getCommentsByApplicationUseCase.execute({
        applicationId: id,
      });

      sendSuccessResponse(res, 'Comments retrieved successfully', comments);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };


}
