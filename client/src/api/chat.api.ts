import { api } from './index';
import type { ChatMessageResponseDto, ConversationResponseDto, PaginatedResponse } from '@/interfaces/chat';
import { ChatRoutes } from '@/constants/api-routes';

export const chatApi = {
  async getConversations(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ success: boolean; message: string; data: PaginatedResponse<ConversationResponseDto> }>(ChatRoutes.CONVERSATIONS, {
      params,
    });
    return data.data;
  },

  async getMessages(conversationId: string, params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ success: boolean; message: string; data: PaginatedResponse<ChatMessageResponseDto> }>(
      ChatRoutes.CONVERSATIONS_MESSAGES.replace(':conversationId', conversationId),
      { params },
    );
    return data.data;
  },

  async sendMessage(payload: { receiverId: string; content: string; conversationId: string; replyToMessageId?: string }) {
    const { data } = await api.post<{ success: boolean; message: string; data: { conversation: ConversationResponseDto; message: ChatMessageResponseDto } }>(
      ChatRoutes.MESSAGES,
      payload,
    );
    return data.data;
  },

  async createConversation(payload: { participantId: string }) {
    const { data } = await api.post<{ success: boolean; message: string; data: ConversationResponseDto }>(ChatRoutes.CONVERSATIONS, payload);
    return data.data;
  },

  async markAsRead(conversationId: string) {
    await api.post(ChatRoutes.CONVERSATIONS_READ.replace(':conversationId', conversationId));
  },

  async deleteMessage(messageId: string) {
    await api.delete<{ success: boolean; message: string; data: null }>(ChatRoutes.MESSAGES_DELETE.replace(':messageId', messageId));
  },
};
