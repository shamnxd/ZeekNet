import { Router } from 'express';
import { ChatController } from '../controllers/chat/chat.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { SendMessageDto } from '../../application/dto/chat/send-message.dto';
import { CreateConversationDto } from '../../application/dto/chat/create-conversation.dto';
import { GetConversationsQueryDto } from '../../application/dto/chat/get-conversations-query.dto';
import { GetMessagesQueryDto } from '../../application/dto/chat/get-messages-query.dto';
import { UserBlockedMiddleware } from '../middleware/user-blocked.middleware';
import { IUserRepository } from '../../domain/interfaces/repositories/user/IUserRepository';

export class ChatRouter {  
  public router: Router;

  constructor(controller: ChatController, userRepository: IUserRepository) {
    this.router = Router();
    const userBlockedMiddleware = new UserBlockedMiddleware(userRepository);
    this.setupRoutes(controller, userBlockedMiddleware);
  }

  private setupRoutes(controller: ChatController, userBlockedMiddleware: UserBlockedMiddleware): void {
    this.router.use(authenticateToken, userBlockedMiddleware.checkUserBlocked);

    this.router.post('/conversations', validateBody(CreateConversationDto), controller.createConversation);
    this.router.get('/conversations', validateQuery(GetConversationsQueryDto), controller.getConversations);
    this.router.get(
      '/conversations/:conversationId/messages',
      validateQuery(GetMessagesQueryDto),
      controller.getMessages,
    );
    this.router.post('/messages', validateBody(SendMessageDto), controller.sendMessage);
    this.router.delete('/messages/:messageId', controller.deleteMessage);
    this.router.post('/conversations/:conversationId/read', controller.markAsRead);
  }
}
