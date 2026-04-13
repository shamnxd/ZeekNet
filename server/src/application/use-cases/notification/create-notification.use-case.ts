import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';
import { INotificationRepository, CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { ICreateNotificationUseCase } from 'src/domain/interfaces/use-cases/notification/management/ICreateNotificationUseCase';
import { NotificationResponseDto } from 'src/application/dtos/notification/management/responses/notification-response.dto';

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @inject(TYPES.NotificationRepository) private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationData): Promise<NotificationResponseDto> {
    const notification = await this._notificationRepository.create(
      NotificationMapper.toEntity({
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        isRead: false,
      }),
    );
    return NotificationMapper.toResponse(notification);
  }
}

