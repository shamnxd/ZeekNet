export interface ISocketConnectionManager {
    registerConnection(userId: string, socketId: string): void;
    unregisterConnection(userId: string, socketId: string): void;
    getUserSockets(userId: string): Set<string> | undefined;
    isUserOnline(userId: string): boolean;
}
