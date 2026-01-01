import { Server as SocketIOServer } from 'socket.io';

export interface ISocketServer {
  getIO(): SocketIOServer;
}
