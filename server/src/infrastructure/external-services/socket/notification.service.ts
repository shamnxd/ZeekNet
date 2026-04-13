import { injectable, inject } from 'inversify';
import { Server as SocketIOServer } from 'socket.io';
import { TYPES } from 'src/shared/constants/types';
import { CreateNotificationData } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { ICreateNotificationUseCase } from 'src/domain/interfaces/use-cases/notification/management/ICreateNotificationUseCase';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';

@injectable()
export class NotificationService implements INotificationService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string> = new Map();

  constructor(
    @inject(TYPES.CreateNotificationUseCase) private readonly createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  setIO(io: SocketIOServer): void {
    this.io = io;
  }

  registerUser(userId: string, socketId: string): void {
    this.userSockets.set(userId, socketId);
  }

  unregisterUser(userId: string): void {
    this.userSockets.delete(userId);
  }

  async sendNotification(data: CreateNotificationData): Promise<void> {
    const notification = await this.createNotificationUseCase.execute(data);

    const socketId = this.userSockets.get(data.user_id);
    if (socketId && this.io) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  sendUserBlockedEvent(userId: string): void {
    const socketId = this.userSockets.get(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit('user-blocked', {
        message: 'Your account has been blocked by the administrator',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
