import { api } from './index';
import type { ApiEnvelope } from '@/interfaces/auth';

import { NotificationRoutes } from '@/constants/api-routes';

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
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return (await api.get<ApiEnvelope<Notification[]>>(`${NotificationRoutes.GET_NOTIFICATIONS}${query}`)).data;
  },

  async getUnreadCount(): Promise<ApiEnvelope<{ count: number }>> {
    return (await api.get<ApiEnvelope<{ count: number }>>(NotificationRoutes.UNREAD_COUNT)).data;
  },

  async markAsRead(id: string): Promise<ApiEnvelope<Notification>> {
    return (await api.patch<ApiEnvelope<Notification>>(NotificationRoutes.MARK_READ.replace(':id', id), {})).data;
  },

  async markAllAsRead(): Promise<ApiEnvelope<void>> {
    return (await api.patch<ApiEnvelope<void>>(NotificationRoutes.READ_ALL, {})).data;
  },
};
