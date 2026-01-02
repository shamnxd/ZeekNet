import { Router } from 'express';
import { NotificationController } from 'src/presentation/controllers/notification/notification.controller';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

export class NotificationRouter {
  public router: Router;

  constructor(controller: NotificationController) {
    this.router = Router();
    this.setupRoutes(controller);
  }

  private setupRoutes(controller: NotificationController): void {
    this.router.get('/', authenticateToken, controller.getNotifications);
    this.router.get('/unread-count', authenticateToken, controller.getUnreadCount);
    this.router.patch('/:id/read', authenticateToken, controller.markAsRead);
    this.router.patch('/read-all', authenticateToken, controller.markAllAsRead);
  }
}

