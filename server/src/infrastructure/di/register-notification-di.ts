import { Container } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { NotificationRepository } from 'src/infrastructure/persistence/mongodb/repositories/notification.repository';
import { ICreateNotificationUseCase } from 'src/domain/interfaces/use-cases/notification/management/ICreateNotificationUseCase';
import {
  IGetNotificationsUseCase,
  IMarkNotificationAsReadUseCase,
  IMarkAllNotificationsAsReadUseCase,
  IGetUnreadNotificationCountUseCase,
} from 'src/domain/interfaces/use-cases/notification/management/INotificationUseCases';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/create-notification.use-case';
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/get-notifications.use-case';
import { MarkNotificationAsReadUseCase } from 'src/application/use-cases/notification/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from 'src/application/use-cases/notification/mark-all-notifications-as-read.use-case';
import { GetUnreadNotificationCountUseCase } from 'src/application/use-cases/notification/get-unread-notification-count.use-case';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { NotificationService } from 'src/infrastructure/external-services/socket/notification.service';
import { NotificationController } from 'src/presentation/controllers/notification/notification.controller';
import { NotificationRouter } from 'src/presentation/routes/notification-router';

export function registerNotificationDi(container: Container): void {
  container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
  container.bind<ICreateNotificationUseCase>(TYPES.CreateNotificationUseCase).to(CreateNotificationUseCase);
  container.bind<IGetNotificationsUseCase>(TYPES.GetNotificationsUseCase).to(GetNotificationsUseCase);
  container.bind<IMarkNotificationAsReadUseCase>(TYPES.MarkNotificationAsReadUseCase).to(MarkNotificationAsReadUseCase);
  container.bind<IMarkAllNotificationsAsReadUseCase>(TYPES.MarkAllNotificationsAsReadUseCase).to(MarkAllNotificationsAsReadUseCase);
  container.bind<IGetUnreadNotificationCountUseCase>(TYPES.GetUnreadNotificationCountUseCase).to(GetUnreadNotificationCountUseCase);
  container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService).inSingletonScope();
  container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);
  container.bind<NotificationRouter>(TYPES.NotificationRouter).to(NotificationRouter);
}
