import { api } from './index';
import type { ChatMessageResponseDto, ConversationResponseDto, PaginatedResponse } from '@/interfaces/chat';

export const chatApi = {
  async getConversations(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ success: boolean; message: string; data: PaginatedResponse<ConversationResponseDto> }>('/api/chat/conversations', {
      params,
    });
    return data.data;
  },

  async getMessages(conversationId: string, params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ success: boolean; message: string; data: PaginatedResponse<ChatMessageResponseDto> }>(
      `/api/chat/conversations/${conversationId}/messages`,
      { params },
    );
    return data.data;
  },

  async sendMessage(payload: { receiverId: string; content: string; conversationId: string; replyToMessageId?: string }) {
    const { data } = await api.post<{ success: boolean; message: string; data: { conversation: ConversationResponseDto; message: ChatMessageResponseDto } }>(
      '/api/chat/messages',
      payload,
    );
    return data.data;
  },

  async createConversation(payload: { participantId: string }) {
    const { data } = await api.post<{ success: boolean; message: string; data: ConversationResponseDto }>('/api/chat/conversations', payload);
    return data.data;
  },

  async markAsRead(conversationId: string) {
    await api.post(`/api/chat/conversations/${conversationId}/read`);
  },

  async deleteMessage(messageId: string) {
    await api.delete<{ success: boolean; message: string; data: null }>(`/api/chat/messages/${messageId}`);
  },
};
