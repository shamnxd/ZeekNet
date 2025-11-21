import { Notification } from '../../entities/notification.entity';
import { CreateNotificationData } from '../repositories/notification/INotificationRepository';

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<Notification>;
}

export interface IGetNotificationsUseCase {
  execute(userId: string, limit: number, skip: number): Promise<Notification[]>;
}

export interface IMarkNotificationAsReadUseCase {
  execute(userId: string, notificationId: string): Promise<Notification | null>;
}

export interface IMarkAllNotificationsAsReadUseCase {
  execute(userId: string): Promise<void>;
}

export interface IGetUnreadNotificationCountUseCase {
  execute(userId: string): Promise<number>;
}
