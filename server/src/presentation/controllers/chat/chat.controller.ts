import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IChatService } from 'src/domain/interfaces/services/IChatService';
import { handleAsyncError, sendSuccessResponse, validateUserId } from 'src/shared/utils/presentation/controller.utils';

export class ChatController {
  constructor(private readonly _chatService: IChatService) {}

  createConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { participantId } = req.body as { participantId: string };

      const conversation = await this._chatService.createConversation(userId, participantId);
      sendSuccessResponse(res, 'Conversation ready', conversation);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { receiverId, content, conversationId, replyToMessageId } = req.body as {
        receiverId: string;
        content: string;
        conversationId: string;
        replyToMessageId?: string;
      };

      const result = await this._chatService.sendMessage({ senderId: userId, receiverId, content, conversationId, replyToMessageId });
      sendSuccessResponse(res, 'Message sent successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { page = 1, limit = 20 } = req.query as { page?: number; limit?: number };

      const conversations = await this._chatService.getConversations(userId, Number(page) || 1, Number(limit) || 20);
      sendSuccessResponse(res, 'Conversations retrieved successfully', conversations);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
      const conversationId = req.params.conversationId;

      const messages = await this._chatService.getMessages(userId, conversationId, Number(page) || 1, Number(limit) || 50);
      sendSuccessResponse(res, 'Messages retrieved successfully', messages);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const conversationId = req.params.conversationId;

      await this._chatService.markMessagesAsRead(userId, conversationId);
      sendSuccessResponse(res, 'Messages marked as read', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };


  deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const messageId = req.params.messageId;

      await this._chatService.deleteMessage(userId, messageId);
      sendSuccessResponse(res, 'Message deleted successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}