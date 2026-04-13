import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { IMarkAllNotificationsAsReadUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';

@injectable()
export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
  constructor(
    @inject(TYPES.NotificationRepository) private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepository.markAllAsRead(userId);
  }
}
