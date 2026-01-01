import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IGetNotificationsUseCase } from '../../../domain/interfaces/use-cases/notifications/INotificationUseCases';
import { NotificationResponseDto } from '../../dtos/notification/responses/notification-response.dto';
import { NotificationMapper } from '../../mappers/notification/notification.mapper';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, limit: number, skip: number): Promise<NotificationResponseDto[]> {
    const page = Math.floor(skip / limit) + 1;
    const result = await this._notificationRepository.paginate(
      { user_id: userId },
      {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    );
    return NotificationMapper.toResponseList(result.data);
  }
}


