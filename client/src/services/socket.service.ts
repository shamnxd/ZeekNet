import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userBlockedCallback: ((data: unknown) => void) | null = null;

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
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('user-blocked', (data) => {
      console.log('User blocked event received:', data);
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

  /* Notifications */
  onNotification(callback: (notification: unknown) => void): void {
    this.socket?.on('notification', callback);
  }

  offNotification(callback?: (notification: unknown) => void): void {
    this.socket?.off('notification', callback);
  }

  /* Chat */
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

  onMessageReceived(callback: (data: unknown) => void) {
    this.socket?.on('message_received', callback);
  }

  offMessageReceived(callback?: (data: unknown) => void) {
    this.socket?.off('message_received', callback);
  }

  onMessagesRead(callback: (data: unknown) => void) {
    this.socket?.on('messages_read', callback);
  }

  offMessagesRead(callback?: (data: unknown) => void) {
    this.socket?.off('messages_read', callback);
  }

  onTyping(callback: (data: unknown) => void) {
    this.socket?.on('typing_indicator', callback);
  }

  offTyping(callback?: (data: unknown) => void) {
    this.socket?.off('typing_indicator', callback);
  }

  onMessageDeleted(callback: (data: unknown) => void) {
    this.socket?.on('message_deleted', callback);
  }

  offMessageDeleted(callback?: (data: unknown) => void) {
    this.socket?.off('message_deleted', callback);
  }

  onUserBlocked(callback: (data: unknown) => void): void {
    this.userBlockedCallback = callback;
  }

  offUserBlocked(): void {
    this.userBlockedCallback = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();


