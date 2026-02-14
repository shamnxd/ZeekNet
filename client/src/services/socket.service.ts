import { io, Socket } from 'socket.io-client';
import type { NotificationSocketData, UserBlockedData } from '@/types/socket.types';

class SocketService {
  private socket: Socket | null = null;
  private userBlockedCallback: ((data: UserBlockedData) => void) | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    this.socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {

    });

    this.socket.on('disconnect', () => {

    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('user-blocked', (data) => {
      if (this.userBlockedCallback) {
        this.userBlockedCallback(data);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }


  onNotification(callback: (notification: NotificationSocketData) => void): void {
    this.socket?.on('notification', callback);
  }

  offNotification(callback?: (notification: NotificationSocketData) => void): void {
    this.socket?.off('notification', callback);
  }


  emitSendMessage(payload: { receiverId: string; content: string; conversationId: string }, cb?: (resp: unknown) => void) {
    this.socket?.emit('send_message', payload, cb);
  }

  emitTyping(payload: { conversationId: string; receiverId: string }) {
    this.socket?.emit('typing_indicator', payload);
  }

  emitMarkAsRead(payload: { conversationId: string }, cb?: (resp: unknown) => void) {
    this.socket?.emit('mark_as_read', payload, cb);
  }

  joinConversation(conversationId: string, cb?: (resp: unknown) => void) {
    this.socket?.emit('join_conversation', { conversationId }, cb);
  }

  onMessageReceived(callback: (data: import('@/types/socket.types').ChatMessagePayload) => void) {
    this.socket?.on('message_received', callback);
  }

  offMessageReceived(callback?: (data: import('@/types/socket.types').ChatMessagePayload) => void) {
    this.socket?.off('message_received', callback);
  }

  onMessagesRead(callback: (data: import('@/types/socket.types').MessagesReadPayload) => void) {
    this.socket?.on('messages_read', callback);
  }

  offMessagesRead(callback?: (data: import('@/types/socket.types').MessagesReadPayload) => void) {
    this.socket?.off('messages_read', callback);
  }

  onTyping(callback: (data: import('@/types/socket.types').TypingPayload) => void) {
    this.socket?.on('typing_indicator', callback);
  }

  offTyping(callback?: (data: import('@/types/socket.types').TypingPayload) => void) {
    this.socket?.off('typing_indicator', callback);
  }

  onMessageDeleted(callback: (data: import('@/types/socket.types').MessageDeletedPayload) => void) {
    this.socket?.on('message_deleted', callback);
  }

  offMessageDeleted(callback?: (data: import('@/types/socket.types').MessageDeletedPayload) => void) {
    this.socket?.off('message_deleted', callback);
  }

  onUserOnline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user_online', callback);
  }

  offUserOnline(callback?: (data: { userId: string }) => void) {
    this.socket?.off('user_online', callback);
  }

  onUserOffline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user_offline', callback);
  }

  offUserOffline(callback?: (data: { userId: string }) => void) {
    this.socket?.off('user_offline', callback);
  }

  onOnlineUsers(callback: (userIds: string[]) => void) {
    this.socket?.on('get_online_users', callback);
  }

  offOnlineUsers(callback?: (userIds: string[]) => void) {
    this.socket?.off('get_online_users', callback);
  }

  requestOnlineUsers() {
    this.socket?.emit('request_online_users');
  }

  onUserBlocked(callback: (data: UserBlockedData) => void): void {
    this.userBlockedCallback = callback;
  }

  offUserBlocked(): void {
    this.userBlockedCallback = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();


