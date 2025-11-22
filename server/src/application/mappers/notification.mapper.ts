import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDocument } from '../../infrastructure/database/mongodb/models/notification.model';
import { NotificationResponseDto } from '../dto/notification/notification-response.dto';
import { Types } from 'mongoose';

export class NotificationMapper {
  static toDomain(doc: NotificationDocument | Record<string, unknown>): Notification {
    const asDoc = doc as unknown as {
      _id?: unknown;
      user_id?: unknown;
      type?: unknown;
      title?: unknown;
      message?: unknown;
      data?: unknown;
      is_read?: unknown;
      read_at?: unknown;
      createdAt?: unknown;
    };

    return Notification.create({
      id: String(asDoc._id ?? ''),
      userId: String(asDoc.user_id ?? ''),
      type: asDoc.type as Notification['type'],
      title: String(asDoc.title ?? ''),
      message: String(asDoc.message ?? ''),
      data: (asDoc.data as Record<string, unknown>) || {},
      isRead: Boolean(asDoc.is_read),
      readAt: asDoc.read_at as Date | undefined,
      createdAt: (asDoc.createdAt as Date) || new Date(),
    });
  }

  static toPersistence(entity: Partial<Notification>): Partial<NotificationDocument> {
    const doc: Partial<NotificationDocument> = {};

    if (entity.userId !== undefined) doc.user_id = new Types.ObjectId(entity.userId);
    if (entity.type !== undefined) doc.type = entity.type;
    if (entity.title !== undefined) doc.title = entity.title;
    if (entity.message !== undefined) doc.message = entity.message;
    if (entity.data !== undefined) doc.data = entity.data;
    if (entity.isRead !== undefined) doc.is_read = entity.isRead;
    if (entity.readAt !== undefined) doc.read_at = entity.readAt;

    return doc;
  }

  static toDto(notification: Notification): NotificationResponseDto {
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

  static toListDto(notifications: Notification[]): NotificationResponseDto[] {
    return notifications.map((notification) => this.toDto(notification));
  }
}
