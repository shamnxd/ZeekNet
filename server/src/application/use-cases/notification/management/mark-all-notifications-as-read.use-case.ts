import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { IMarkAllNotificationsAsReadUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';

export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepository.markAllAsRead(userId);
  }
}
