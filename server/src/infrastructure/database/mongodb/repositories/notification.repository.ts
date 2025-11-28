import { NotificationModel, NotificationDocument } from '../models/notification.model';
import { INotificationRepository, CreateNotificationData } from '../../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from '../../../../domain/entities/notification.entity';
import { RepositoryBase } from './base-repository';
import { Types } from 'mongoose';
import { NotificationMapper } from '../mappers/notification.mapper';

export class NotificationRepository extends RepositoryBase<Notification, NotificationDocument> implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  }

  protected mapToEntity(document: NotificationDocument): Notification {
    return NotificationMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Notification>): Partial<NotificationDocument> {
    return NotificationMapper.toDocument(entity);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { is_read: true },
    );
  }
}

