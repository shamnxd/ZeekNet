import { INotificationRepository, CreateNotificationData } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from '../../../domain/entities/notification.entity';
import { ICreateNotificationUseCase } from '../../../domain/interfaces/use-cases/notification/ICreateNotificationUseCase';

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationData): Promise<Notification> {
    return this._notificationRepository.create({
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      isRead: false,
    } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
  }
}
