import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';
import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { IMarkNotificationAsReadUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<NotificationResponseDto | null> {
    const notification = await this._notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ValidationError('You can only mark your own notifications as read');
    }

    if (notification.isRead) {
      return NotificationMapper.toResponse(notification); 
    }

    const updatedNotification = await this._notificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });

    if (!updatedNotification) {
      throw new NotFoundError('Failed to update notification');
    }

    return NotificationMapper.toResponse(updatedNotification);
  }
}


