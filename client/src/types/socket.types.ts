

export interface NotificationSocketData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserBlockedData {
  userId: string;
  isBlocked: boolean;
  reason?: string;
}

export interface ChatMessagePayload {
  conversationId: string;
  message: {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    status?: string;
    readAt?: string;
    isDeleted?: boolean;
    replyToMessageId?: string;
  };
  participants: string[];
}

export interface MessagesReadPayload {
  conversationId: string;
}

export interface TypingPayload {
  conversationId: string;
  senderId: string;
}

export interface MessageDeletedPayload {
  conversationId: string;
  messageId: string;
}
