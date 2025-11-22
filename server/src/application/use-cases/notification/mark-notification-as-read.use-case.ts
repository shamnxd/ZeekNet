import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IMarkNotificationAsReadUseCase } from '../../../domain/interfaces/use-cases/INotificationUseCases';
import { NotificationResponseDto } from '../../dto/notification/notification-response.dto';
import { NotificationMapper } from '../../mappers/notification.mapper';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<NotificationResponseDto | null> {
    // First verify the notification exists and belongs to the user
    const notification = await this._notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ValidationError('You can only mark your own notifications as read');
    }

    if (notification.isRead) {
      return NotificationMapper.toDto(notification); // Already read, return as-is
    }

    // Use base repository update method
    const updatedNotification = await this._notificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });

    if (!updatedNotification) {
      throw new NotFoundError('Failed to update notification');
    }

    return NotificationMapper.toDto(updatedNotification);
  }
}
