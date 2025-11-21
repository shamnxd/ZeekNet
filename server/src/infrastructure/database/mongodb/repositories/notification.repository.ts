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

  async findByUserId(userId: string, limit: number, skip: number): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ user_id: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    return notifications.map(doc => this.mapToEntity(doc));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { is_read: true },
    );
  }
}

