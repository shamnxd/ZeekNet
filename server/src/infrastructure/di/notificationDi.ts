import { NotificationRepository } from 'src/infrastructure/persistence/mongodb/repositories/notification.repository';
import { NotificationController } from 'src/presentation/controllers/notification/notification.controller';
import { NotificationRouter } from 'src/presentation/routes/notification-router';
import { NotificationService } from 'src/infrastructure/external-services/socket/notification.service';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/management/create-notification.use-case';
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/management/get-notifications.use-case';
import { MarkNotificationAsReadUseCase } from 'src/application/use-cases/notification/management/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from 'src/application/use-cases/notification/management/mark-all-notifications-as-read.use-case';
import { GetUnreadNotificationCountUseCase } from 'src/application/use-cases/notification/management/get-unread-notification-count.use-case';

const notificationRepository = new NotificationRepository();

const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(notificationRepository);

export const notificationService = new NotificationService(createNotificationUseCase);

const notificationController = new NotificationController(
  getNotificationsUseCase,
  markNotificationAsReadUseCase,
  markAllNotificationsAsReadUseCase,
  getUnreadNotificationCountUseCase,
);

export const notificationRouter = new NotificationRouter(notificationController);
export { notificationRepository };

