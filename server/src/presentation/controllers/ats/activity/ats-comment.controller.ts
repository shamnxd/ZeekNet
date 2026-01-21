import { NextFunction, Response } from 'express';

import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';
import { IAddCompensationNoteUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCompensationNoteUseCase';
import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCommentsByApplicationUseCase';
import { IGetCompensationNotesUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCompensationNotesUseCase';

import { AddCommentRequestDtoSchema } from 'src/application/dtos/application/comments/requests/add-comment-request.dto';
import { AddCompensationNoteRequestDtoSchema } from 'src/application/dtos/application/comments/requests/add-compensation-note-request.dto';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class ATSCommentController {
  constructor(
    private readonly addCommentUseCase: IAddCommentUseCase,
    private readonly addCompensationNoteUseCase: IAddCompensationNoteUseCase,
    private readonly getCommentsByApplicationUseCase: IGetCommentsByApplicationUseCase,
    private readonly getCompensationNotesUseCase: IGetCompensationNotesUseCase,
  ) { }

  addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedBody = AddCommentRequestDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const { id: userId, email } = req.user!;

      const comment = await this.addCommentUseCase.execute({
        ...parsedBody.data,
        addedBy: userId,
        addedByName: email,
      });

      sendCreatedResponse(res, 'Comment added successfully', comment);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCommentsByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      const comments = await this.getCommentsByApplicationUseCase.execute({
        applicationId: parsedParams.data.id,
      });

      sendSuccessResponse(res, 'Comments retrieved successfully', comments);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addCompensationNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    const parsedBody = AddCompensationNoteRequestDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const { id: userId, email } = req.user!;

      const comment = await this.addCompensationNoteUseCase.execute({
        applicationId: parsedParams.data.id,
        note: parsedBody.data.note,
        addedBy: userId,
        addedByName: email,
      });

      sendCreatedResponse(res, 'Compensation note added successfully', comment);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensationNotes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      const compensationNotes = await this.getCompensationNotesUseCase.execute({
        applicationId: parsedParams.data.id,
      });

      sendSuccessResponse(res, 'Compensation notes retrieved successfully', compensationNotes);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
