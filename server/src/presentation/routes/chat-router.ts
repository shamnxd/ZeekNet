import { Router } from 'express';
import { ChatController } from '../controllers/chat/chat.controller';
import { ChatRoutes } from '../../domain/enums/routes.enum';
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

    this.router.post(ChatRoutes.CONVERSATIONS, validateBody(CreateConversationDto), controller.createConversation);
    this.router.get(ChatRoutes.CONVERSATIONS, validateQuery(GetConversationsQueryDto), controller.getConversations);
    this.router.get(
      ChatRoutes.CONVERSATIONS_MESSAGES,
      validateQuery(GetMessagesQueryDto),
      controller.getMessages,
    );
    this.router.post(ChatRoutes.MESSAGES, validateBody(SendMessageDto), controller.sendMessage);
    this.router.delete(ChatRoutes.MESSAGES_DELETE, controller.deleteMessage);
    this.router.post(ChatRoutes.CONVERSATIONS_READ, controller.markAsRead);
  }
}
