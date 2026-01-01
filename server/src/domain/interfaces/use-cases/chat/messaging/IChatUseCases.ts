import { Conversation } from 'src/domain/entities/conversation.entity';
import { ChatMessage } from 'src/domain/entities/chat-message.entity';

export interface SendMessageInput {
  senderId: string;
  receiverId: string;
  content: string;
  conversationId: string;
  replyToMessageId?: string;
}

export interface IDeleteMessageUseCase {
  execute(userId: string, messageId: string): Promise<ChatMessage | null>;
}

export interface ISendMessageUseCase {
  execute(data: SendMessageInput): Promise<{ conversation: Conversation; message: ChatMessage }>;
}

export interface ICreateConversationUseCase {
  execute(creatorId: string, participantId: string): Promise<Conversation>;
}

export interface IGetConversationsUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<{
    data: Conversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export interface IGetMessagesUseCase {
  execute(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
    data: ChatMessage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export interface IMarkMessagesAsReadUseCase {
  execute(userId: string, conversationId: string): Promise<void>;
}
