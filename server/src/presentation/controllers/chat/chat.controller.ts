import { Response, NextFunction } from 'express';
import { CreateConversationRequestDtoSchema } from 'src/application/dtos/chat/requests/create-conversation-request.dto';
import { SendMessageRequestDtoSchema } from 'src/application/dtos/chat/requests/send-message-request.dto';
import { GetConversationsRequestDtoSchema } from 'src/application/dtos/chat/requests/get-conversations-request.dto';
import { GetMessagesRequestDtoSchema } from 'src/application/dtos/chat/requests/get-messages-request.dto';
import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class ChatController {
  constructor(
    @inject(TYPES.CreateConversationUseCase) private readonly _createConversationUseCase: ICreateConversationUseCase,
    @inject(TYPES.SendMessageUseCase) private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.GetConversationsUseCase) private readonly _getConversationsUseCase: IGetConversationsUseCase,
    @inject(TYPES.GetMessagesUseCase) private readonly _getMessagesUseCase: IGetMessagesUseCase,
    @inject(TYPES.MarkMessagesAsReadUseCase) private readonly _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    @inject(TYPES.DeleteMessageUseCase) private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
  ) { }


  createConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const parsed = CreateConversationRequestDtoSchema.safeParse(req.body);
      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const conversation = await this._createConversationUseCase.execute({
        creatorId: userId,
        participantId: parsed.data.participantId,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Conversation setup'), conversation);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const parsed = SendMessageRequestDtoSchema.safeParse(req.body);
      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const result = await this._sendMessageUseCase.execute({
        ...parsed.data,
        senderId: userId,
      });

      sendSuccessResponse(res, SUCCESS.CREATED('Message'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const parsed = GetConversationsRequestDtoSchema.safeParse({
        userId,
        ...req.query,
      });

      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const result = await this._getConversationsUseCase.execute(parsed.data);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Conversations'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const conversationId = req.params.conversationId;

      const parsed = GetMessagesRequestDtoSchema.safeParse({
        userId,
        conversationId,
        ...req.query,
      });

      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const result = await this._getMessagesUseCase.execute(parsed.data);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Messages'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const conversationId = req.params.conversationId;

      await this._markMessagesAsReadUseCase.execute({
        userId,
        conversationId,
      });

      sendSuccessResponse(res, SUCCESS.UPDATED('Messages read status'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const messageId = req.params.messageId;

      await this._deleteMessageUseCase.execute({
        userId,
        messageId,
      });

      sendSuccessResponse(res, SUCCESS.DELETED('Message'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}