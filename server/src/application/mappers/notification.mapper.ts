import { Notification } from '../../domain/entities/notification.entity';
import { NotificationDocument } from '../../infrastructure/database/mongodb/models/notification.model';

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
}
