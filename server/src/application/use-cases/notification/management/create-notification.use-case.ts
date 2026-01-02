import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';
import { INotificationRepository, CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from 'src/domain/entities/notification.entity';
import { ICreateNotificationUseCase } from 'src/domain/interfaces/use-cases/notification/management/ICreateNotificationUseCase';

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationData): Promise<Notification> {
    return this._notificationRepository.create(
      NotificationMapper.toEntity({
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        isRead: false,
      }),
    );
  }
}

