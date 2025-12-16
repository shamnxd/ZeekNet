import { Conversation } from '../../../entities/conversation.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ConversationQueryOptions {
  page?: number;
  limit?: number;
}

export interface IConversationRepository extends IBaseRepository<Conversation> {
  findByParticipants(userAId: string, userBId: string): Promise<Conversation | null>;
  getUserConversations(userId: string, options?: ConversationQueryOptions): Promise<{
    data: Conversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  updateLastMessage(
    conversationId: string,
    lastMessage: { messageId: string; senderId: string; content: string; createdAt: Date },
    unreadUserId: string,
  ): Promise<Conversation | null>;
  resetUnread(conversationId: string, userId: string): Promise<Conversation | null>;
}

