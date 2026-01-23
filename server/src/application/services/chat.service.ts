import { Server as SocketIOServer } from 'socket.io';
import { IChatService } from 'src/domain/interfaces/services/IChatService';
import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';

import { ChatMessageResponseDto } from 'src/application/dtos/chat/responses/chat-message-response.dto';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';
import { SendMessageDto } from 'src/application/dtos/chat/requests/send-message.dto';

export class ChatService implements IChatService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    private readonly _getConversationsUseCase: IGetConversationsUseCase,
    private readonly _getMessagesUseCase: IGetMessagesUseCase,
    private readonly _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    private readonly _createConversationUseCase: ICreateConversationUseCase,
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    private readonly _conversationRepository: IConversationRepository,
  ) { }

  setIO(io: SocketIOServer): void {
    this.io = io;
  }

  registerConnection(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socketId);
  }

  unregisterConnection(userId: string, socketId: string): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.userSockets.delete(userId);
    }
  }

  async createConversation(creatorId: string, participantId: string) {
    return this._createConversationUseCase.execute({ creatorId, participantId });
  }

  async sendMessage(data: SendMessageDto) {
    const result = await this._sendMessageUseCase.execute(data);
    this.emitMessageDelivered(result.message, result.conversation);
    return result;
  }

  async getConversations(userId: string, page = 1, limit = 20) {
    return this._getConversationsUseCase.execute({ userId, page, limit });
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    return this._getMessagesUseCase.execute({ userId, conversationId, page, limit });
  }

  async markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
    const conversation = await this._markMessagesAsReadUseCase.execute({ userId, conversationId });
    if (!conversation) return;

    const otherParticipant = conversation.participants.find((p) => p.userId !== userId);
    if (otherParticipant) {
      this.emitMessagesRead(conversationId, userId, otherParticipant.userId);
    }
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const result = await this._deleteMessageUseCase.execute({ userId, messageId });
    if (result && result.conversation) {
      this.emitMessageDeleted(result.message, result.conversation);
    }
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

  emitTyping(conversationId: string, senderId: string, receiverId: string): void {
    if (!this.io) return;
    const payload = {
      conversationId,
      senderId,
      timestamp: new Date().toISOString(),
    };

    this.io.to(this.getUserRoom(receiverId)).emit('typing_indicator', payload);
  }

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

  emitMessagesRead(conversationId: string, readerId: string, otherParticipantId: string): void {
    if (!this.io) return;
    const room = this.getUserRoom(otherParticipantId);
    const payload = { conversationId, readerId };

    this.io.to(room).emit('messages_read', payload);
  }

  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  private getConversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }

  async ensureParticipant(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this._conversationRepository.findById(conversationId);
    return !!conversation?.participants.some((p) => p.userId === userId);
  }
}
