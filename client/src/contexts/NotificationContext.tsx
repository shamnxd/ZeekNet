import React, { useEffect, useState, useCallback } from 'react';
import { notificationApi } from '../api/notification.api';
import type { Notification } from '../api/notification.api';
import { socketService } from '../services/socket.service';
import { useAppSelector } from '../hooks/useRedux';
import { toast } from 'sonner';
import { NotificationContext } from './notification-context-definition';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token as string);

  const refreshNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        notificationApi.getNotifications({ limit: 50 }),
        notificationApi.getUnreadCount(),
      ]);

      if (notificationsRes?.data) {
        setNotifications(notificationsRes.data);
      }
      if (countRes?.data?.count !== undefined) {
        setUnreadCount(countRes.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
      refreshNotifications();

      const handleNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(notification.title, {
          description: notification.message,
        });
      };

      const handleSocketNotification = (data: import('@/types/socket.types').NotificationSocketData) => {
        const notification: Notification = {
          id: data.id,
          user_id: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          isRead: data.isRead,
          createdAt: data.createdAt,
          
          readAt: undefined, 
          data: {} 
        };
        handleNotification(notification);
      };

      socketService.onNotification(handleSocketNotification);

      return () => {
        socketService.offNotification(handleSocketNotification);
      };
    } else {
      socketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token, refreshNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
