import { NotificationModel, NotificationDocument } from '../models/notification.model';
import { NotificationMapper } from '../../../../application/mappers/notification.mapper';
import { INotificationRepository, CreateNotificationData } from '../../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from '../../../../domain/entities/notification.entity';
import { RepositoryBase } from './base-repository';
import { Types } from 'mongoose';

export class NotificationRepository extends RepositoryBase<Notification, NotificationDocument> implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  }

  protected mapToEntity(document: NotificationDocument): Notification {
    return NotificationMapper.toDomain(document);
  }

  protected mapToDocument(entity: Partial<Notification>): Partial<NotificationDocument> {
    const doc: Partial<NotificationDocument> = {};

    if (entity.userId !== undefined) doc.user_id = new Types.ObjectId(entity.userId);
    if (entity.type !== undefined) doc.type = entity.type;
    if (entity.title !== undefined) doc.title = entity.title;
    if (entity.message !== undefined) doc.message = entity.message;
    if (entity.data !== undefined) doc.data = entity.data;
    if (entity.isRead !== undefined) doc.is_read = entity.isRead;

    return doc;
  }

  // Override to match interface signature
  async create(data: CreateNotificationData): Promise<Notification> {
    const notification = new NotificationModel({
      user_id: new Types.ObjectId(data.user_id),
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      is_read: false,
    });

    await notification.save();
    return this.mapToEntity(notification);
  }

  async findByUserId(userId: string, limit: number, skip: number): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ user_id: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    return notifications.map(doc => this.mapToEntity(doc));
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification | null> {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, user_id: new Types.ObjectId(userId) },
      { is_read: true },
      { new: true }
    );
    
    return notification ? this.mapToEntity(notification) : null;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { is_read: true }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      user_id: new Types.ObjectId(userId),
      is_read: false
    });
  }
}

