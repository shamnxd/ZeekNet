import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IGetNotificationsUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { IMarkNotificationAsReadUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { IMarkAllNotificationsAsReadUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { IGetUnreadNotificationCountUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { sendSuccessResponse, handleAsyncError, validateUserId } from 'src/shared/utils/presentation/controller.utils';

export class NotificationController {
  constructor(
    private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
    private readonly _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private readonly _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase,
    private readonly _getUnreadNotificationCountUseCase: IGetUnreadNotificationCountUseCase,
  ) {}

  getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;

      const notifications = await this._getNotificationsUseCase.execute(userId, limit, skip);
      sendSuccessResponse(res, 'Notifications retrieved successfully', notifications);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const notificationId = req.params.id;

      const notification = await this._markNotificationAsReadUseCase.execute(userId, notificationId);
      sendSuccessResponse(res, 'Notification marked as read', notification);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      await this._markAllNotificationsAsReadUseCase.execute(userId);
      sendSuccessResponse(res, 'All notifications marked as read', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const count = await this._getUnreadNotificationCountUseCase.execute(userId);
      sendSuccessResponse(res, 'Unread count retrieved successfully', { count });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


