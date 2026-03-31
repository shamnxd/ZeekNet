import { Router } from 'express';
import { notificationController } from 'src/infrastructure/di/notificationDi';
import { APP_ROUTES } from 'src/shared/constants/routes';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

export class NotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get(APP_ROUTES.NOTIFICATIONS.GET_ALL, notificationController.getNotifications);
    this.router.get(APP_ROUTES.NOTIFICATIONS.UNREAD_COUNT, notificationController.getUnreadCount);
    this.router.patch(APP_ROUTES.NOTIFICATIONS.MARK_READ, notificationController.markAsRead);
    this.router.patch(APP_ROUTES.NOTIFICATIONS.MARK_ALL_READ, notificationController.markAllAsRead);
  }
}


