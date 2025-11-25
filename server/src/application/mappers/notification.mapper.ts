import { Notification } from '../../domain/entities/notification.entity';
import { NotificationResponseDto } from '../dto/notification/notification-response.dto';

export class NotificationMapper {
  static toResponse(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      data: notification.data,
      readAt: notification.readAt,
    };
  }

  static toResponseList(notifications: Notification[]): NotificationResponseDto[] {
    return notifications.map((notification) => this.toResponse(notification));
  }
}
