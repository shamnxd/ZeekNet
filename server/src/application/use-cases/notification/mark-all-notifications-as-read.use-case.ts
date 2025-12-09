import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IMarkAllNotificationsAsReadUseCase } from '../../../domain/interfaces/use-cases/notifications/INotificationUseCases';

export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepository.markAllAsRead(userId);
  }
}
