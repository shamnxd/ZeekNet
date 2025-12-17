import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { JwtTokenService } from '../../security/jwt-token-service';
import { notificationService } from '../../di/notificationDi';
import { chatService } from '../../di/chatDi';
import { logger } from '../../config/logger';
import { env } from '../../config/env';
import { ISocketServer } from 'src/domain/interfaces/services/ISocketServer';

export class SocketServer implements ISocketServer {
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
    chatService.setIO(this.io);
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

      socket.join(`user:${userId}`);
      chatService.registerConnection(userId, socket.id);
      notificationService.registerUser(userId, socket.id);

      socket.on(
        'send_message',
        async (
          payload: { receiverId: string; content: string; conversationId: string },
          callback?: (response: unknown) => void,
        ) => {
          try {
            const { receiverId, content, conversationId } = payload || {};
            if (!conversationId) {
              callback?.({ success: false, message: 'conversationId is required' });
              return;
            }
            const result = await chatService.sendMessage({
              senderId: userId,
              receiverId,
              content,
              conversationId,
            });
            callback?.({ success: true, data: result });
          } catch (error) {
            logger.error('Error handling send_message event:', error);
            callback?.({
              success: false,
              message: error instanceof Error ? error.message : 'Failed to send message',
            });
          }
        },
      );

      socket.on(
        'join_conversation',
        async (payload: { conversationId: string }, callback?: (response: unknown) => void) => {
          const conversationId = payload?.conversationId;
          if (!conversationId) {
            callback?.({ success: false, message: 'conversationId is required' });
            return;
          }

          const isParticipant = await chatService.ensureParticipant(conversationId, userId);
          if (!isParticipant) {
            callback?.({ success: false, message: 'Not authorized for this conversation' });
            return;
          }

          socket.join(`conversation:${conversationId}`);
          callback?.({ success: true });
        },
      );

      socket.on(
        'typing_indicator',
        (payload: { conversationId: string; receiverId: string } | undefined) => {
          if (!payload?.conversationId || !payload.receiverId) return;
          chatService.emitTyping(payload.conversationId, userId, payload.receiverId);
        },
      );

      socket.on(
        'mark_as_read',
        async (payload: { conversationId: string } | undefined, callback?: (response: unknown) => void) => {
          if (!payload?.conversationId) {
            callback?.({ success: false, message: 'conversationId is required' });
            return;
          }

          try {
            await chatService.markMessagesAsRead(userId, payload.conversationId);
            callback?.({ success: true });
          } catch (error) {
            logger.error('Error handling mark_as_read event:', error);
            callback?.({
              success: false,
              message: error instanceof Error ? error.message : 'Failed to mark messages as read',
            });
          }
        },
      );

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id} for user: ${userId}`);
        chatService.unregisterConnection(userId, socket.id);
        notificationService.unregisterUser(userId);
      });
    });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}

