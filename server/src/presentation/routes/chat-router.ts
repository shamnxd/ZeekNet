import { Router } from 'express';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { validateBody, validateQuery } from 'src/presentation/middleware/validation.middleware';
import { SendMessageDto } from 'src/application/dtos/chat/requests/send-message.dto';
import { CreateConversationDto } from 'src/application/dtos/chat/requests/create-conversation.dto';
import { GetConversationsQueryDto } from 'src/application/dtos/chat/requests/get-conversations-query.dto';
import { GetMessagesQueryDto } from 'src/application/dtos/chat/requests/get-messages-query.dto';
import { UserBlockedMiddleware } from 'src/presentation/middleware/user-blocked.middleware';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

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
    this.router.get('/conversations/:conversationId/messages', validateQuery(GetMessagesQueryDto), controller.getMessages );
    this.router.post('/messages', validateBody(SendMessageDto), controller.sendMessage);
    this.router.delete('/messages/:messageId', controller.deleteMessage);
    this.router.post('/conversations/:conversationId/read', controller.markAsRead);
  }
}

