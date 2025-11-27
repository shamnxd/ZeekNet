import { Notification } from '../../../entities/notification.entity';
import { IBaseRepository } from '../IBaseRepository';
import { NotificationType } from '../../../entities/notification.entity';

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface INotificationRepository extends IBaseRepository<Notification> {
  markAllAsRead(userId: string): Promise<void>;
}

