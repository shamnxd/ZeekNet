import { Router } from 'express';
import { NotificationController } from '../controllers/notification/notification.controller';
import { NotificationRoutes } from '../../domain/enums/routes.enum';
import { authenticateToken } from '../middleware/auth.middleware';

export class NotificationRouter {
  public router: Router;

  constructor(controller: NotificationController) {
    this.router = Router();
    this.setupRoutes(controller);
  }

  private setupRoutes(controller: NotificationController): void {
    this.router.get(NotificationRoutes.GET_NOTIFICATIONS, authenticateToken, controller.getNotifications);
    this.router.get(NotificationRoutes.UNREAD_COUNT, authenticateToken, controller.getUnreadCount);
    this.router.patch(NotificationRoutes.MARK_READ, authenticateToken, controller.markAsRead);
    this.router.patch(NotificationRoutes.READ_ALL, authenticateToken, controller.markAllAsRead);
  }
}

