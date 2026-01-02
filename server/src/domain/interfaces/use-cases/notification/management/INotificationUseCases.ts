import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';
import { CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from 'src/domain/entities/notification.entity';

export interface IGetNotificationsUseCase {
  execute(userId: string, limit: number, skip: number): Promise<NotificationResponseDto[]>;
}

export interface IGetUnreadNotificationCountUseCase {
  execute(userId: string): Promise<number>;
}

export interface IMarkNotificationAsReadUseCase {
  execute(userId: string, notificationId: string): Promise<NotificationResponseDto | null>;
}

export interface IMarkAllNotificationsAsReadUseCase {
  execute(userId: string): Promise<void>;
}

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<Notification>;
}
