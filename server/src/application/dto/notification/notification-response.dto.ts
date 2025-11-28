import { NotificationType } from '../../../domain/entities/notification.entity';

export interface NotificationResponseDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
  readAt?: Date;
}
