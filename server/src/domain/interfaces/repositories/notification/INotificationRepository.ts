import { Notification } from '../../../entities/notification.entity';
import { IBaseRepository } from '../IBaseRepository';
import { NotificationType } from '../../../../infrastructure/database/mongodb/models/notification.model';

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface INotificationRepository extends Omit<IBaseRepository<Notification>, 'create'> {
  // Custom create signature for notifications
  create(data: CreateNotificationData): Promise<Notification>;
  
  // Notification-specific methods
  findByUserId(userId: string, limit: number, skip: number): Promise<Notification[]>;
  markAsRead(notificationId: string, userId: string): Promise<Notification | null>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

