import { Router } from 'express';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';

const chatController = container.get<ChatController>(TYPES.ChatController);
const chatUserRepository = container.get<IUserRepository>(TYPES.UserRepository);
const getUserByIdUseCase = container.get<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase);


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


