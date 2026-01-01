import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { JwtTokenService } from 'src/infrastructure/security/jwt-token-service';
import { notificationService } from 'src/infrastructure/di/notificationDi';
import { chatService } from 'src/infrastructure/di/chatDi';
import { logger } from 'src/infrastructure/config/logger';
import { env } from 'src/infrastructure/config/env';
import { ISocketServer } from 'src/domain/interfaces/services/ISocketServer';

export class SocketServer implements ISocketServer {
  private io: SocketIOServer;
  private webrtcRooms: Map<string, Set<string>> = new Map(); 

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

      
      socket.on('webrtc:join-room', (payload: { roomId: string }, callback?: (response: unknown) => void) => {
        try {
          const { roomId } = payload || {};
          if (!roomId) {
            callback?.({ success: false, message: 'roomId is required' });
            return;
          }

          socket.join(`webrtc:${roomId}`);
          
          
          if (!this.webrtcRooms.has(roomId)) {
            this.webrtcRooms.set(roomId, new Set());
          }
          this.webrtcRooms.get(roomId)!.add(socket.id);

          
          const otherParticipants = Array.from(this.webrtcRooms.get(roomId)!).filter(id => id !== socket.id);
          socket.to(`webrtc:${roomId}`).emit('webrtc:user-joined', { socketId: socket.id, userId });

          logger.info(`User ${userId} joined WebRTC room: ${roomId}`);
          callback?.({ success: true, participants: otherParticipants.length });
        } catch (error) {
          logger.error('Error handling webrtc:join-room:', error);
          callback?.({ success: false, message: 'Failed to join room' });
        }
      });

      socket.on('webrtc:offer', (payload: { roomId: string; offer: RTCSessionDescriptionInit; targetSocketId?: string }) => {
        try {
          const { roomId, offer, targetSocketId } = payload || {};
          if (!roomId || !offer) {
            return;
          }

          if (targetSocketId) {
            
            socket.to(targetSocketId).emit('webrtc:offer', { offer, socketId: socket.id });
          } else {
            
            socket.to(`webrtc:${roomId}`).emit('webrtc:offer', { offer, socketId: socket.id });
          }
        } catch (error) {
          logger.error('Error handling webrtc:offer:', error);
        }
      });

      socket.on('webrtc:answer', (payload: { roomId: string; answer: RTCSessionDescriptionInit; targetSocketId?: string }) => {
        try {
          const { roomId, answer, targetSocketId } = payload || {};
          if (!roomId || !answer) {
            return;
          }

          if (targetSocketId) {
            
            socket.to(targetSocketId).emit('webrtc:answer', { answer, socketId: socket.id });
          } else {
            
            socket.to(`webrtc:${roomId}`).emit('webrtc:answer', { answer, socketId: socket.id });
          }
        } catch (error) {
          logger.error('Error handling webrtc:answer:', error);
        }
      });

      socket.on('webrtc:ice-candidate', (payload: { roomId: string; candidate: RTCIceCandidateInit; targetSocketId?: string }) => {
        try {
          const { roomId, candidate, targetSocketId } = payload || {};
          if (!roomId || !candidate) {
            return;
          }

          if (targetSocketId) {
            
            socket.to(targetSocketId).emit('webrtc:ice-candidate', { candidate, socketId: socket.id });
          } else {
            
            socket.to(`webrtc:${roomId}`).emit('webrtc:ice-candidate', { candidate, socketId: socket.id });
          }
        } catch (error) {
          logger.error('Error handling webrtc:ice-candidate:', error);
        }
      });

      socket.on('webrtc:leave-room', (payload: { roomId: string }) => {
        try {
          const { roomId } = payload || {};
          if (!roomId) {
            return;
          }

          socket.leave(`webrtc:${roomId}`);
          
          
          const roomParticipants = this.webrtcRooms.get(roomId);
          if (roomParticipants) {
            roomParticipants.delete(socket.id);
            if (roomParticipants.size === 0) {
              this.webrtcRooms.delete(roomId);
            } else {
              
              socket.to(`webrtc:${roomId}`).emit('webrtc:user-left', { socketId: socket.id });
            }
          }

          logger.info(`User ${userId} left WebRTC room: ${roomId}`);
        } catch (error) {
          logger.error('Error handling webrtc:leave-room:', error);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id} for user: ${userId}`);
        chatService.unregisterConnection(userId, socket.id);
        notificationService.unregisterUser(userId);

        
        this.webrtcRooms.forEach((participants, roomId) => {
          if (participants.has(socket.id)) {
            participants.delete(socket.id);
            socket.to(`webrtc:${roomId}`).emit('webrtc:user-left', { socketId: socket.id });
            if (participants.size === 0) {
              this.webrtcRooms.delete(roomId);
            }
          }
        });
      });
    });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}

