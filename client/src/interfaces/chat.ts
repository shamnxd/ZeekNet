export interface ConversationParticipantDto {
  userId: string;
  role: string;
  unreadCount: number;
  lastReadAt?: string | null;
}

export interface LastMessageDto {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ConversationResponseDto {
  id: string;
  participants: ConversationParticipantDto[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: LastMessageDto | null;
}

export interface ChatMessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: 'sent' | 'read';
  createdAt: string;
  readAt?: string | null;
  replyToMessageId?: string | null;
  replyToMessage?: {
    id: string;
    content: string;
    senderId: string;
  } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
