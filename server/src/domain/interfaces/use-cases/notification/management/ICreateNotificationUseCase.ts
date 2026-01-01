import { CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from 'src/domain/entities/notification.entity';

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<Notification>;
}
