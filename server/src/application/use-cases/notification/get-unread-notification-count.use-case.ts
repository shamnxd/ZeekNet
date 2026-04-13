import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetUnreadNotificationCountUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';

@injectable()
export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(
    @inject(TYPES.NotificationRepository) private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepository.countDocuments({
      user_id: userId,
      is_read: false,
    });
  }
}
