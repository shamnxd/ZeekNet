import { Notification } from 'src/domain/entities/notification.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';
import { NotificationType } from 'src/domain/enums/notification-type.enum';

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

