import { ChatMessageResponseDto } from '../../../application/dto/chat/chat-message-response.dto';
import { ConversationResponseDto } from '../../../application/dto/chat/conversation-response.dto';
import { ChatMessage } from '../../entities/chat-message.entity';
import { Conversation } from '../../entities/conversation.entity';
import { SendMessageInput } from '../use-cases/chat/IChatUseCases';

export interface IChatService {
  setIO(io: import('socket.io').Server): void;
  registerConnection(userId: string, socketId: string): void;
  unregisterConnection(userId: string, socketId: string): void;
  createConversation(creatorId: string, participantId: string): Promise<ConversationResponseDto>;
  sendMessage(data: SendMessageInput): Promise<{
    conversation: ConversationResponseDto;
    message: ChatMessageResponseDto;
  }>;
  getConversations(userId: string, page?: number, limit?: number): Promise<{
    data: ConversationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getMessages(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
    data: ChatMessageResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  markMessagesAsRead(userId: string, conversationId: string): Promise<void>;
  deleteMessage(userId: string, messageId: string): Promise<void>;
  emitTyping(conversationId: string, senderId: string, receiverId: string): void;
  emitMessageDelivered(message: ChatMessage, conversation: Conversation): void;
  emitMessagesRead(conversationId: string, readerId: string, otherParticipantId: string): void;
  ensureParticipant(conversationId: string, userId: string): Promise<boolean>;
}
