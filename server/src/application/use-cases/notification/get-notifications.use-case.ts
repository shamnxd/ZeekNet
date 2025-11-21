import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IGetNotificationsUseCase } from '../../../domain/interfaces/use-cases/INotificationUseCases';
import { Notification } from '../../../domain/entities/notification.entity';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, limit: number, skip: number): Promise<Notification[]> {
    return this._notificationRepository.findByUserId(userId, limit, skip);
  }
}
