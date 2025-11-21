import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IGetUnreadNotificationCountUseCase } from '../../../domain/interfaces/use-cases/INotificationUseCases';

export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepository.getUnreadCount(userId);
  }
}
