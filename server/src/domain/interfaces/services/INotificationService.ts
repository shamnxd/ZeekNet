import { Server as SocketIOServer } from 'socket.io';
import { CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';

export interface INotificationService {
  setIO(io: SocketIOServer): void;
  registerUser(userId: string, socketId: string): void;
  unregisterUser(userId: string): void;
  sendNotification(data: CreateNotificationData): Promise<void>;
  sendUserBlockedEvent(userId: string): void;
}
