import { Router } from 'express';
import { chatController, chatUserRepository } from 'src/infrastructure/di/chatDi';
import { getUserByIdUseCase } from 'src/infrastructure/di/authDi';
import { APP_ROUTES } from 'src/shared/constants/routes';

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

    this.router.post(APP_ROUTES.CHAT.CONVERSATIONS, chatController.createConversation);
    this.router.get(APP_ROUTES.CHAT.CONVERSATIONS, chatController.getConversations);
    this.router.get(APP_ROUTES.CHAT.CONVERSATION_MESSAGES, chatController.getMessages);
    this.router.post(APP_ROUTES.CHAT.MESSAGES, chatController.sendMessage);
    this.router.delete(APP_ROUTES.CHAT.MESSAGE_BY_ID, chatController.deleteMessage);
    this.router.post(APP_ROUTES.CHAT.CONVERSATION_READ, chatController.markAsRead);
  }
}


