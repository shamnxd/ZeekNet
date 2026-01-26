import { Router } from 'express';
import { chatController, chatUserRepository } from 'src/infrastructure/di/chatDi';
import { getUserByIdUseCase } from 'src/infrastructure/di/authDi';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { UserBlockedMiddleware } from 'src/presentation/middleware/user-blocked.middleware';

export class ChatRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);

    this.router.use(authenticateToken, userBlockedMiddleware.checkUserBlocked);

    this.router.post('/conversations', chatController.createConversation);
    this.router.get('/conversations', chatController.getConversations);
    this.router.get('/conversations/:conversationId/messages', chatController.getMessages);
    this.router.post('/messages', chatController.sendMessage);
    this.router.delete('/messages/:messageId', chatController.deleteMessage);
    this.router.post('/conversations/:conversationId/read', chatController.markAsRead);
  }
}

