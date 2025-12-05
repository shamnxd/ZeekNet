import { api } from './index';
import type { ApiEnvelope } from '@/interfaces/auth';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export const notificationApi = {
  async getNotifications(params?: { limit?: number; skip?: number }): Promise<ApiEnvelope<Notification[]>> {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return (await api.get<ApiEnvelope<Notification[]>>(`/api/notifications${query}`)).data;
  },

  async getUnreadCount(): Promise<ApiEnvelope<{ count: number }>> {
    return (await api.get<ApiEnvelope<{ count: number }>>('/api/notifications/unread-count')).data;
  },

  async markAsRead(id: string): Promise<ApiEnvelope<Notification>> {
    return (await api.patch<ApiEnvelope<Notification>>(`/api/notifications/${id}/read`, {})).data;
  },

  async markAllAsRead(): Promise<ApiEnvelope<void>> {
    return (await api.patch<ApiEnvelope<void>>('/api/notifications/read-all', {})).data;
  },
};
