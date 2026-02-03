import { Router } from 'express';
import { notificationController } from 'src/infrastructure/di/notificationDi';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

export class NotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get('/', notificationController.getNotifications);
    this.router.get('/unread-count', notificationController.getUnreadCount);
    this.router.patch('/:id/read', notificationController.markAsRead);
    this.router.patch('/read-all', notificationController.markAllAsRead);
  }
}

