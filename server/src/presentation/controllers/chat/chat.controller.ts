import { Response, NextFunction } from 'express';

import { CreateConversationRequestDtoSchema } from 'src/application/dtos/chat/requests/create-conversation-request.dto';
import { SendMessageRequestDtoSchema } from 'src/application/dtos/chat/requests/send-message-request.dto';
import { GetConversationsRequestDtoSchema } from 'src/application/dtos/chat/requests/get-conversations-request.dto';
import { GetMessagesRequestDtoSchema } from 'src/application/dtos/chat/requests/get-messages-request.dto';

import { IChatService } from 'src/domain/interfaces/services/IChatService';
import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId
} from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';

export class ChatController {
  constructor(
    private readonly _createConversationUseCase: ICreateConversationUseCase,
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    private readonly _getConversationsUseCase: IGetConversationsUseCase,
    private readonly _getMessagesUseCase: IGetMessagesUseCase,
    private readonly _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    private readonly _chatSocketService: IChatService,
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
        participantId: parsed.data.participantId
      });

      sendSuccessResponse(res, 'Conversation ready', conversation);
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

      this._chatSocketService.emitMessageDelivered(result.message, result.conversation);

      sendSuccessResponse(res, 'Message sent successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const parsed = GetConversationsRequestDtoSchema.safeParse({
        userId,
        ...req.query
      });

      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const result = await this._getConversationsUseCase.execute(parsed.data);

      sendSuccessResponse(res, 'Conversations retrieved successfully', result);
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
        ...req.query
      });

      if (!parsed.success) {
        handleValidationError(formatZodErrors(parsed.error), next);
        return;
      }

      const result = await this._getMessagesUseCase.execute(parsed.data);

      sendSuccessResponse(res, 'Messages retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const conversationId = req.params.conversationId;

      const conversation = await this._markMessagesAsReadUseCase.execute({
        userId,
        conversationId
      });

      const otherParticipant = conversation.participants.find((p) => p.userId !== userId);
      if (otherParticipant) {
        this._chatSocketService.emitMessagesRead(conversationId, userId, otherParticipant.userId);
      }

      sendSuccessResponse(res, 'Messages marked as read', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const messageId = req.params.messageId;

      const result = await this._deleteMessageUseCase.execute({
        userId,
        messageId
      });

      if (result && result.conversation) {
        this._chatSocketService.emitMessageDeleted(result.message, result.conversation);
      }

      sendSuccessResponse(res, 'Message deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}