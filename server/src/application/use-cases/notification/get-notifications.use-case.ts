import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IGetNotificationsUseCase } from '../../../domain/interfaces/use-cases/INotificationUseCases';
import { Notification } from '../../../domain/entities/notification.entity';
import { Types } from 'mongoose';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, limit: number, skip: number): Promise<Notification[]> {
    const page = Math.floor(skip / limit) + 1;
    const result = await this._notificationRepository.paginate(
      { user_id: new Types.ObjectId(userId) },
      {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    );
    return result.data;
  }
}
