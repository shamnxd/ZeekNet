import { CreateNotificationData } from '../../repositories/notification/INotificationRepository';
import { Notification } from '../../../entities/notification.entity';

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationData): Promise<Notification>;
}
