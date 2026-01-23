import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';
import { SendMessageDto } from 'src/application/dtos/chat/requests/send-message.dto';
import { PaginatedConversationsResponseDto } from 'src/application/dtos/chat/responses/paginated-conversations-response.dto';
import { PaginatedMessagesResponseDto } from 'src/application/dtos/chat/responses/paginated-messages-response.dto';
import { SendMessageResponseDto } from 'src/application/dtos/chat/responses/send-message-response.dto';
import { ChatMessageResponseDto } from 'src/application/dtos/chat/responses/chat-message-response.dto';

export interface IChatService {
  setIO(io: import('socket.io').Server): void;
  registerConnection(userId: string, socketId: string): void;
  unregisterConnection(userId: string, socketId: string): void;

  // Use Case wrappers (legacy/support)
  createConversation(creatorId: string, participantId: string): Promise<ConversationResponseDto>;
  sendMessage(data: SendMessageDto): Promise<SendMessageResponseDto>;
  getConversations(userId: string, page?: number, limit?: number): Promise<PaginatedConversationsResponseDto>;
  getMessages(userId: string, conversationId: string, page?: number, limit?: number): Promise<PaginatedMessagesResponseDto>;
  markMessagesAsRead(userId: string, conversationId: string): Promise<void>;
  deleteMessage(userId: string, messageId: string): Promise<void>;
  ensureParticipant(conversationId: string, userId: string): Promise<boolean>;

  // Socket Emitters
  emitTyping(conversationId: string, senderId: string, receiverId: string): void;
  emitMessageDelivered(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void;
  emitMessagesRead(conversationId: string, readerId: string, otherParticipantId: string): void;
  emitMessageDeleted(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void;
}
