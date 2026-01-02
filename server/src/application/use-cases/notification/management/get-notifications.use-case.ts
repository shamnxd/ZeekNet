import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { IGetNotificationsUseCase } from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';
import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';

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


