import { Server as SocketIOServer } from 'socket.io';
import { IChatService } from '../../domain/interfaces/services/IChatService';
import {
  ISendMessageUseCase,
  IGetConversationsUseCase,
  IGetMessagesUseCase,
  IMarkMessagesAsReadUseCase,
  ICreateConversationUseCase,
  IDeleteMessageUseCase,
  SendMessageInput,
} from '../../domain/interfaces/use-cases/chat/IChatUseCases';
import { ConversationMapper } from '../mappers/chat/conversation.mapper';
import { ChatMessageMapper } from '../mappers/chat/chat-message.mapper';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { Conversation } from '../../domain/entities/conversation.entity';
import { IConversationRepository } from '../../domain/interfaces/repositories/chat/IConversationRepository';

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
  ) {}

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
    const conversation = await this._createConversationUseCase.execute(creatorId, participantId);
    return ConversationMapper.toResponse(conversation);
  }

  async sendMessage(data: SendMessageInput) {
    const result = await this._sendMessageUseCase.execute(data);
    this.emitMessageDelivered(result.message, result.conversation);
    return {
      conversation: ConversationMapper.toResponse(result.conversation),
      message: ChatMessageMapper.toResponse(result.message),
    };
  }

  async getConversations(userId: string, page = 1, limit = 20) {
    const result = await this._getConversationsUseCase.execute(userId, page, limit);
    return {
      ...result,
      data: ConversationMapper.toResponseList(result.data),
    };
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    const result = await this._getMessagesUseCase.execute(userId, conversationId, page, limit);
    return {
      ...result,
      data: ChatMessageMapper.toResponseList(result.data),
    };
  }

  async markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
    await this._markMessagesAsReadUseCase.execute(userId, conversationId);
    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) return;

    const otherParticipant = conversation.participants.find((p) => p.userId !== userId);
    if (otherParticipant) {
      this.emitMessagesRead(conversationId, userId, otherParticipant.userId);
    }
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const deletedMessage = await this._deleteMessageUseCase.execute(userId, messageId);
    if (deletedMessage) {
      const conversation = await this._conversationRepository.findById(deletedMessage.conversationId);
      if (conversation) {
        this.emitMessageDeleted(deletedMessage, conversation);
      }
    }
  }

  emitMessageDeleted(message: ChatMessage, conversation: Conversation): void {
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

  emitMessageDelivered(message: ChatMessage, conversation: Conversation): void {
    if (!this.io) return;
    const payload = {
      conversationId: conversation.id,
      message: ChatMessageMapper.toResponse(message),
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


