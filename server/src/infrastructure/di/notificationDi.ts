import { NotificationRepository } from '../persistence/mongodb/repositories/notification.repository';
import { NotificationController } from '../../presentation/controllers/notification/notification.controller';
import { NotificationRouter } from '../../presentation/routes/notification-router';
import { NotificationService } from '../external-services/socket/notification.service';
import { CreateNotificationUseCase } from '../../application/use-cases/notification/create-notification.use-case';
import { GetNotificationsUseCase } from '../../application/use-cases/notification/get-notifications.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/notification/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../../application/use-cases/notification/mark-all-notifications-as-read.use-case';
import { GetUnreadNotificationCountUseCase } from '../../application/use-cases/notification/get-unread-notification-count.use-case';

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

