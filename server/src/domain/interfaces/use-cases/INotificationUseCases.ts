import { Notification } from '../../entities/notification.entity';
import { NotificationResponseDto } from '../../../application/dto/notification/notification-response.dto';
import { CreateNotificationData } from '../repositories/notification/INotificationRepository';
import { GetNotificationsRequestDto } from 'src/application/dto/notification/get-notifications.dto';

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<Notification>;
}

export interface IGetNotificationsUseCase {
  execute(data: GetNotificationsRequestDto): Promise<NotificationResponseDto[]>;
}

export interface IMarkNotificationAsReadUseCase {
  execute(userId: string, notificationId: string): Promise<NotificationResponseDto | null>;
}

export interface IMarkAllNotificationsAsReadUseCase {
  execute(userId: string): Promise<void>;
}

export interface IGetUnreadNotificationCountUseCase {
  execute(userId: string): Promise<number>;
}
