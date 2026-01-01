import { NotificationType } from '../../../../domain/enums/notification-type.enum';

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

