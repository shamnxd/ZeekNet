import { Notification } from 'src/domain/entities/notification.entity';
import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';
import { NotificationType } from 'src/domain/enums/notification-type.enum';
import { CreateInput } from 'src/domain/types/common.types';

export class NotificationMapper {
  static toEntity(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead?: boolean;
    data?: Record<string, unknown>;
  }): CreateInput<Notification> {
    return {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: data.isRead ?? false,
      data: data.data,
    };
  }

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


