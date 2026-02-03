import { CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<NotificationResponseDto>;
}
