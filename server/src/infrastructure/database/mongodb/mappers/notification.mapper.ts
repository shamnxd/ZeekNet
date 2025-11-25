import { Notification } from '../../../../domain/entities/notification.entity';
import { NotificationDocument } from '../models/notification.model';
import { Types } from 'mongoose';

export class NotificationMapper {
  static toEntity(doc: NotificationDocument): Notification {
    return Notification.create({
      id: String(doc._id),
      userId: String(doc.user_id),
      type: doc.type,
      title: doc.title,
      message: doc.message,
      isRead: doc.is_read,
      createdAt: doc.created_at,
      data: doc.data,
      readAt: doc.read_at,
    });
  }

  static toDocument(entity: Partial<Notification>): Partial<NotificationDocument> {
    const doc: Partial<NotificationDocument> = {};
    if (entity.userId) doc.user_id = new Types.ObjectId(entity.userId);
    if (entity.type) doc.type = entity.type;
    if (entity.title) doc.title = entity.title;
    if (entity.message) doc.message = entity.message;
    if (entity.data !== undefined) doc.data = entity.data;
    if (entity.isRead !== undefined) doc.is_read = entity.isRead;
    if (entity.readAt !== undefined) doc.read_at = entity.readAt;

    return doc;
  }
}
