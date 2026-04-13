import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import {
  IGetNotificationsUseCase,
  IMarkNotificationAsReadUseCase,
  IMarkAllNotificationsAsReadUseCase,
  IGetUnreadNotificationCountUseCase,
} from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { sendSuccessResponse, handleAsyncError, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.GetNotificationsUseCase) private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
    @inject(TYPES.MarkNotificationAsReadUseCase) private readonly _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    @inject(TYPES.MarkAllNotificationsAsReadUseCase) private readonly _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase,
    @inject(TYPES.GetUnreadNotificationCountUseCase) private readonly _getUnreadNotificationCountUseCase: IGetUnreadNotificationCountUseCase,
  ) { }

  getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;

      const notifications = await this._getNotificationsUseCase.execute(userId, limit, skip);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Notifications'), notifications);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const notificationId = req.params.id;

      const notification = await this._markNotificationAsReadUseCase.execute(userId, notificationId);
      sendSuccessResponse(res, SUCCESS.UPDATED('Notification read status'), notification);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      await this._markAllNotificationsAsReadUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.ACTION('Clearing all notifications'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const count = await this._getUnreadNotificationCountUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Unread count'), { count });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



