import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userBlockedCallback: ((data: any) => void) | null = null;

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

  onNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  offNotification(callback?: (notification: any) => void): void {
    if (this.socket) {
      this.socket.off('notification', callback);
    }
  }

  onUserBlocked(callback: (data: any) => void): void {
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


