import { IGetUnreadNotificationCountUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';

export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepository.countDocuments({
      user_id: userId,
      is_read: false,
    });
  }
}
