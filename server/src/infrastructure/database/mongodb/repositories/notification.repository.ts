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
    return NotificationMapper.toPersistence(entity);
  }

  async create(data: CreateNotificationData): Promise<Notification> {
    return super.create({
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      isRead: false,
    } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
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
      { new: true },
    );
    
    return notification ? this.mapToEntity(notification) : null;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { is_read: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.countDocuments({
      user_id: new Types.ObjectId(userId),
      is_read: false,
    });
  }
}

