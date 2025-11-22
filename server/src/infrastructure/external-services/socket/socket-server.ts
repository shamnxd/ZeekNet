import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { JwtTokenService } from '../../security/jwt-token-service';
import { notificationService } from '../../di/notificationDi';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    notificationService.setIO(this.io);
  }

  private setupMiddleware(): void {
    const tokenService = new JwtTokenService();

    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const payload = tokenService.verifyAccess(token);
        socket.data.userId = payload.sub;
        next();
      } catch (error) {
        logger.error('Socket authentication failed:', error);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      logger.info(`Socket connected: ${socket.id} for user: ${userId}`);

      notificationService.registerUser(userId, socket.id);

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id} for user: ${userId}`);
        notificationService.unregisterUser(userId);
      });
    });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}

