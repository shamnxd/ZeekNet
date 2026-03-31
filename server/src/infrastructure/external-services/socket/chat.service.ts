import { Server as SocketIOServer } from 'socket.io';
import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { ISocketConnectionManager } from 'src/domain/interfaces/services/ISocketConnectionManager';
import { ChatMessageResponseDto } from 'src/application/dtos/chat/responses/chat-message-response.dto';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';

export class ChatSocketService implements IChatSocketService, ISocketConnectionManager {
  private io: SocketIOServer | null = null;
  private _userSockets: Map<string, Set<string>> = new Map();

  setIO(io: SocketIOServer): void {
    this.io = io;
  }

  // Connection Management Methods
  registerConnection(userId: string, socketId: string): void {
    if (!this._userSockets.has(userId)) {
      this._userSockets.set(userId, new Set());
    }
    this._userSockets.get(userId)?.add(socketId);
  }

  unregisterConnection(userId: string, socketId: string): void {
    const sockets = this._userSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      this._userSockets.delete(userId);
    }
  }

  getUserSockets(userId: string): Set<string> | undefined {
    return this._userSockets.get(userId);
  }

  isUserOnline(userId: string): boolean {
    const sockets = this._userSockets.get(userId);
    return !!sockets && sockets.size > 0;
  }

  // Chat Emit Methods
  emitMessageDelivered(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void {
    if (!this.io) return;
    const payload = {
      conversationId: conversation.id,
      message: message,
      participants: conversation.participants.map((p) => p.userId),
    };

    const userRooms = conversation.participants.map((p) => this.getUserRoom(p.userId));
    this.io.to(userRooms).emit('message_received', payload);
  }

  emitMessageDeleted(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void {
    if (!this.io) return;
    const payload = {
      conversationId: conversation.id,
      messageId: message.id,
      participants: conversation.participants.map((p) => p.userId),
    };

    const userRooms = conversation.participants.map((p) => this.getUserRoom(p.userId));
    this.io.to(userRooms).emit('message_deleted', payload);
  }

  emitMessagesRead(conversationId: string, readerId: string, otherParticipantId: string): void {
    if (!this.io) return;
    const room = this.getUserRoom(otherParticipantId);
    const payload = { conversationId, readerId };

    this.io.to(room).emit('messages_read', payload);
  }

  emitTyping(conversationId: string, senderId: string, receiverId: string): void {
    if (!this.io) return;
    const payload = {
      conversationId,
      senderId,
      timestamp: new Date().toISOString(),
    };

    this.io.to(this.getUserRoom(receiverId)).emit('typing_indicator', payload);
  }

  emitUserOnline(userId: string): void {
    if (!this.io) return;
    this.io.emit('user_online', { userId });
  }

  emitUserOffline(userId: string): void {
    if (!this.io) return;
    this.io.emit('user_offline', { userId });
  }

  getOnlineUsers(): string[] {
    return Array.from(this._userSockets.keys());
  }

  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }
}
