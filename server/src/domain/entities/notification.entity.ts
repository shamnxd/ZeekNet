import { NotificationType } from 'src/domain/enums/notification-type.enum';


export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly data?: Record<string, unknown>,
    public readonly readAt?: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead?: boolean;
    createdAt?: Date;
    data?: Record<string, unknown>;
    readAt?: Date;
  }): Notification {
    const now = new Date();
    return new Notification(
      data.id,
      data.userId,
      data.type,
      data.title,
      data.message,
      data.isRead ?? false,
      data.createdAt ?? now,
      data.data,
      data.readAt,
    );
  }
}

