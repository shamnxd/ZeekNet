import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IMarkNotificationAsReadUseCase } from '../../../domain/interfaces/use-cases/INotificationUseCases';
import { Notification } from '../../../domain/entities/notification.entity';
import { NotFoundError } from '../../../domain/errors/errors';

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<Notification | null> {
    const notification = await this._notificationRepository.markAsRead(notificationId, userId);
    
    if (!notification) {
      throw new NotFoundError('Notification not found or already read');
    }

    return notification;
  }
}
