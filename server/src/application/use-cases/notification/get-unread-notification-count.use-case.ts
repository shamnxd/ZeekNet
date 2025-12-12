import { IGetUnreadNotificationCountUseCase } from 'src/domain/interfaces/use-cases/notifications/INotificationUseCases';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Types } from 'mongoose';

export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepository.countDocuments({
      user_id: new Types.ObjectId(userId),
      is_read: false,
    });
  }
}
