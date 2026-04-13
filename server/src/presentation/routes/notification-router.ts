import { injectable, inject } from 'inversify';
import { Router } from 'express';
import { APP_ROUTES } from 'src/shared/constants/routes';
import { TYPES } from 'src/shared/constants/types';
import { NotificationController } from 'src/presentation/controllers/notification/notification.controller';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';

@injectable()
export class NotificationRouter {
  public router: Router;

  constructor(
    @inject(TYPES.NotificationController) private readonly notificationController: NotificationController,
  ) {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get(APP_ROUTES.NOTIFICATIONS.GET_ALL, this.notificationController.getNotifications);
    this.router.get(APP_ROUTES.NOTIFICATIONS.UNREAD_COUNT, this.notificationController.getUnreadCount);
    this.router.patch(APP_ROUTES.NOTIFICATIONS.MARK_READ, this.notificationController.markAsRead);
    this.router.patch(APP_ROUTES.NOTIFICATIONS.MARK_ALL_READ, this.notificationController.markAllAsRead);
  }
}


