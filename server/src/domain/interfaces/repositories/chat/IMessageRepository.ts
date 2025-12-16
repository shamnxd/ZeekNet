import { ChatMessage } from '../../../entities/chat-message.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface MessageQueryOptions {
  page?: number;
  limit?: number;
}

export interface IMessageRepository extends IBaseRepository<ChatMessage> {
  getByConversationId(conversationId: string, options?: MessageQueryOptions): Promise<{
    data: ChatMessage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  markAsRead(conversationId: string, readerId: string): Promise<number>;
}

